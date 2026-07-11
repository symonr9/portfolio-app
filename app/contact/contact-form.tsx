"use client";

import Script from "next/script";
import { useCallback, useState } from "react";

type ContactFormProps = {
  turnstileSiteKey?: string;
};

type SubmissionState =
  | { status: "idle"; message: "" }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

const initialState: SubmissionState = { status: "idle", message: "" };

export function ContactForm({ turnstileSiteKey }: ContactFormProps) {
  const [state, setState] = useState<SubmissionState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const captureSubmittedAt = useCallback((node: HTMLInputElement | null) => {
    if (node && !node.value) {
      node.value = Date.now().toString();
    }
  }, []);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setState(initialState);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        body: new FormData(event.currentTarget),
      });
      const result = (await response.json()) as { message?: string };

      if (!response.ok) {
        setState({
          status: "error",
          message: result.message ?? "The message could not be sent.",
        });
        return;
      }

      event.currentTarget.reset();
      setState({
        status: "success",
        message: result.message ?? "Your message was sent.",
      });
    } catch {
      setState({
        status: "error",
        message: "The message could not be sent. Please try again shortly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form
      className="grid gap-5 rounded-sm border border-foreground/10 bg-surface p-5 shadow-[0_18px_60px_var(--shadow-soft)] sm:p-6"
      encType="multipart/form-data"
      onSubmit={handleSubmit}
    >
      <div aria-hidden="true" className="hidden">
        <label htmlFor="website">
          Website
          <input
            autoComplete="off"
            id="website"
            name="website"
            tabIndex={-1}
            type="text"
          />
        </label>
      </div>
      <input name="submittedAt" ref={captureSubmittedAt} type="hidden" />

      <div className="grid gap-5 sm:grid-cols-2">
        <label className="grid gap-2 text-sm font-semibold" htmlFor="fromEmail">
          From email
          <input
            autoComplete="email"
            className="min-h-12 rounded-sm border border-foreground/15 bg-background px-3 text-base font-normal text-foreground outline-none transition-colors focus:border-accent"
            id="fromEmail"
            maxLength={254}
            name="fromEmail"
            required
            type="email"
          />
        </label>
        <label className="grid gap-2 text-sm font-semibold" htmlFor="phone">
          Phone <span className="font-normal text-muted">(optional)</span>
          <input
            autoComplete="tel"
            className="min-h-12 rounded-sm border border-foreground/15 bg-background px-3 text-base font-normal text-foreground outline-none transition-colors focus:border-accent"
            id="phone"
            maxLength={40}
            name="phone"
            type="tel"
          />
        </label>
      </div>

      <label className="grid gap-2 text-sm font-semibold" htmlFor="subject">
        Subject
        <input
          className="min-h-12 rounded-sm border border-foreground/15 bg-background px-3 text-base font-normal text-foreground outline-none transition-colors focus:border-accent"
          id="subject"
          maxLength={120}
          name="subject"
          required
          type="text"
        />
      </label>

      <label className="grid gap-2 text-sm font-semibold" htmlFor="message">
        Message
        <textarea
          className="min-h-44 resize-y rounded-sm border border-foreground/15 bg-background px-3 py-3 text-base font-normal leading-7 text-foreground outline-none transition-colors focus:border-accent"
          id="message"
          maxLength={5000}
          name="message"
          required
        />
      </label>

      <label className="grid gap-2 text-sm font-semibold" htmlFor="attachment">
        Attachment <span className="font-normal text-muted">(PDF or DOCX only)</span>
        <input
          accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
          className="min-h-12 rounded-sm border border-foreground/15 bg-background px-3 py-2 text-sm font-normal text-foreground file:mr-4 file:rounded-sm file:border-0 file:bg-foreground file:px-3 file:py-2 file:text-sm file:font-semibold file:text-background"
          id="attachment"
          name="attachment"
          type="file"
        />
      </label>

      {turnstileSiteKey ? (
        <div className="min-h-[65px]">
          <Script
            async
            defer
            src="https://challenges.cloudflare.com/turnstile/v0/api.js"
            strategy="afterInteractive"
          />
          <div className="cf-turnstile" data-sitekey={turnstileSiteKey} />
        </div>
      ) : null}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          className="inline-flex min-h-12 items-center justify-center rounded-sm bg-accent px-5 text-sm font-semibold text-accent-contrast transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting ? "Sending..." : "Submit inquiry"}
        </button>
        {state.message ? (
          <p
            aria-live="polite"
            className={
              state.status === "success"
                ? "text-sm font-semibold text-accent-text"
                : "text-sm font-semibold text-muted"
            }
          >
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
