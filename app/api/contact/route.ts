import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MIN_SUBMISSION_MS = 2500;
const MAX_ATTACHMENT_BYTES = 8 * 1024 * 1024;
const MAX_REQUEST_BYTES = 9 * 1024 * 1024;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const RESEND_ENDPOINT = "https://api.resend.com/emails";

const allowedAttachmentTypes = new Map([
  ["application/pdf", ".pdf"],
  [
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".docx",
  ],
]);

type RateLimitRecord = {
  count: number;
  resetAt: number;
};

const rateLimitStore = new Map<string, RateLimitRecord>();

export async function POST(request: Request) {
  const resendApiKey = process.env.RESEND_API_KEY;
  const contactTo = parseEmailList(
    process.env.CONTACT_TO_EMAIL ?? process.env.CONTACT_TO,
  );
  const contactFrom =
    process.env.CONTACT_FROM_EMAIL?.trim() ?? process.env.CONTACT_FROM?.trim();

  if (!resendApiKey || contactTo.length === 0 || !contactFrom) {
    return jsonError("Contact delivery is not configured.", 500);
  }

  const ip = getClientIp(request);
  if (!checkRateLimit(ip)) {
    return jsonError("Too many attempts. Please try again later.", 429);
  }

  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES) {
    return jsonError("Attachments must be 8 MB or smaller.", 413);
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return jsonError("The submitted form data could not be read.", 400);
  }

  if (getText(formData, "website")) {
    return NextResponse.json({ message: "Your message was sent." });
  }

  const submittedAt = Number(getText(formData, "submittedAt"));
  if (!Number.isFinite(submittedAt) || Date.now() - submittedAt < MIN_SUBMISSION_MS) {
    return jsonError("Please take a moment before submitting the form.", 400);
  }

  const turnstileError = await validateTurnstileIfConfigured(formData, ip);
  if (turnstileError) {
    return jsonError(turnstileError, 400);
  }

  const subject = cleanText(getText(formData, "subject"), 120);
  const fromEmail = cleanText(getText(formData, "fromEmail"), 254);
  const phone = cleanText(getText(formData, "phone"), 40);
  const message = cleanText(getText(formData, "message"), 5000);

  if (!subject || !fromEmail || !message) {
    return jsonError("Subject, email, and message are required.", 400);
  }

  if (!isValidEmail(fromEmail)) {
    return jsonError("Enter a valid email address.", 400);
  }

  const attachment = formData.get("attachment");
  const validatedAttachment =
    attachment instanceof File && attachment.size > 0
      ? await validateAttachment(attachment)
      : null;

  if (validatedAttachment?.error) {
    return jsonError(validatedAttachment.error, 400);
  }

  const emailSubject = `Portfolio inquiry: ${subject}`;
  const emailText = [
    `Subject: ${subject}`,
    `From: ${fromEmail}`,
    `Phone: ${phone || "Not provided"}`,
    "",
    message,
  ].join("\n");

  const attachments = validatedAttachment?.attachment
    ? [validatedAttachment.attachment]
    : undefined;

  const resendResponse = await fetch(RESEND_ENDPOINT, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: contactFrom,
      to: contactTo,
      reply_to: fromEmail,
      subject: emailSubject,
      text: emailText,
      attachments,
    }),
  });

  if (!resendResponse.ok) {
    const resendError = await readResendError(resendResponse);
    console.warn(
      [
        "Contact form delivery failed:",
        `status=${resendResponse.status}`,
        `type=${redactSensitiveText(resendError.type ?? "unknown")}`,
        `message=${redactSensitiveText(resendError.message)}`,
      ].join(" "),
    );

    return jsonError(
      getPublicDeliveryError(resendResponse.status, resendError),
      getDeliveryStatus(resendResponse.status),
    );
  }

  return NextResponse.json({
    message: "Your message was sent. Thank you for reaching out.",
  });
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ message }, { status });
}

function getText(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function cleanText(value: string, maxLength: number) {
  return value.replace(/\0/g, "").trim().slice(0, maxLength);
}

function parseEmailList(value: string | undefined) {
  return (
    value
      ?.split(",")
      .map((item) => item.trim())
      .filter(Boolean) ?? []
  );
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function getClientIp(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const netlifyIp = request.headers.get("x-nf-client-connection-ip");
  const realIp = request.headers.get("x-real-ip");

  return (
    netlifyIp ??
    forwardedFor?.split(",")[0]?.trim() ??
    realIp ??
    "unknown"
  );
}

function checkRateLimit(ip: string) {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (record.resetAt <= now) {
      rateLimitStore.delete(key);
    }
  }

  const record = rateLimitStore.get(ip);
  if (!record) {
    rateLimitStore.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  record.count += 1;
  return true;
}

async function validateAttachment(file: File) {
  const extension = getExtension(file.name);
  const expectedExtension = allowedAttachmentTypes.get(file.type);

  if (file.size > MAX_ATTACHMENT_BYTES) {
    return { error: "Attachments must be 8 MB or smaller." };
  }

  if (!expectedExtension || extension !== expectedExtension) {
    return { error: "Only PDF and DOCX attachments are accepted." };
  }

  const arrayBuffer = await file.arrayBuffer();
  if (!hasExpectedFileSignature(extension, arrayBuffer)) {
    return { error: "The attachment does not appear to match its file type." };
  }

  return {
    attachment: {
      content: Buffer.from(arrayBuffer).toString("base64"),
      filename: sanitizeFilename(file.name),
    },
  };
}

function getExtension(filename: string) {
  const dotIndex = filename.lastIndexOf(".");
  return dotIndex === -1 ? "" : filename.slice(dotIndex).toLowerCase();
}

function sanitizeFilename(filename: string) {
  return filename.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 120);
}

function hasExpectedFileSignature(extension: string, arrayBuffer: ArrayBuffer) {
  const bytes = new Uint8Array(arrayBuffer.slice(0, 4));
  if (extension === ".pdf") {
    return (
      bytes[0] === 0x25 &&
      bytes[1] === 0x50 &&
      bytes[2] === 0x44 &&
      bytes[3] === 0x46
    );
  }

  if (extension === ".docx") {
    return bytes[0] === 0x50 && bytes[1] === 0x4b;
  }

  return false;
}

async function validateTurnstileIfConfigured(formData: FormData, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    return null;
  }

  const token = getText(formData, "cf-turnstile-response");
  if (!token) {
    return "Complete the verification challenge before submitting.";
  }

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret,
        response: token,
        remoteip: ip,
      }),
    },
  );

  if (!response.ok) {
    return "Verification could not be completed. Please try again.";
  }

  const result = (await response.json()) as { success?: boolean };
  return result.success
    ? null
    : "Verification failed. Please refresh and try again.";
}

type ResendError = {
  message: string;
  type?: string;
};

async function readResendError(response: Response): Promise<ResendError> {
  const contentType = response.headers.get("content-type") ?? "";
  try {
    if (contentType.includes("application/json")) {
      const body = (await response.json()) as {
        message?: unknown;
        name?: unknown;
        type?: unknown;
        error?: { message?: unknown; name?: unknown; type?: unknown };
      };
      const error = body.error;
      return {
        message:
          getString(error?.message) ??
          getString(body.message) ??
          "Resend rejected the message.",
        type:
          getString(error?.type) ??
          getString(error?.name) ??
          getString(body.type) ??
          getString(body.name),
      };
    }

    return {
      message: (await response.text()) || "Resend rejected the message.",
    };
  } catch {
    return { message: "Resend rejected the message." };
  }
}

function getString(value: unknown) {
  return typeof value === "string" ? value : undefined;
}

function getDeliveryStatus(resendStatus: number) {
  if ([400, 401, 403, 422, 429].includes(resendStatus)) {
    return 502;
  }

  return 502;
}

function getPublicDeliveryError(status: number, error: ResendError) {
  const message = error.message.toLowerCase();
  const type = error.type?.toLowerCase() ?? "";

  if (
    status === 403 &&
    (message.includes("testing emails") || message.includes("verify a domain"))
  ) {
    return "Contact delivery needs a verified Resend sender domain or a matching test recipient.";
  }

  if (
    status === 403 &&
    (message.includes("domain is not verified") ||
      message.includes("not verified") ||
      type.includes("validation"))
  ) {
    return "Contact delivery needs CONTACT_FROM_EMAIL to use a verified Resend domain.";
  }

  if (status === 401 || status === 403 || type.includes("api_key")) {
    return "Contact delivery could not authenticate with Resend. Check the server API key.";
  }

  if (status === 422 && type.includes("invalid_from")) {
    return "Contact delivery needs CONTACT_FROM_EMAIL in a valid sender format.";
  }

  if (status === 422 && type.includes("invalid_attachment")) {
    return "The attachment could not be accepted by the email provider.";
  }

  if (status === 429 || type.includes("quota") || type.includes("rate_limit")) {
    return "Contact delivery is temporarily rate limited by the email provider.";
  }

  return "The message could not be sent. Please try again later.";
}

function redactSensitiveText(value: string) {
  return value
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[email]")
    .replace(/https?:\/\/\S+/gi, "[url]")
    .replace(/\b(?:[a-z0-9-]+\.)+[a-z]{2,}\b/gi, "[domain]")
    .replace(/re_[A-Za-z0-9_:-]+/g, "[api-key]");
}
