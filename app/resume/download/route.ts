import { getContentfulDraftOptions, getProfile } from "@/lib/contentful";

export async function GET() {
  const contentfulOptions = await getContentfulDraftOptions();
  const profile = await getProfile(contentfulOptions);
  const resumePdf = profile.resumePdf;

  if (!resumePdf) {
    return new Response("Resume PDF is not configured.", { status: 404 });
  }

  const response = await fetch(resumePdf.url);

  if (!response.ok || !response.body) {
    return new Response("Resume PDF could not be downloaded.", { status: 502 });
  }

  return new Response(response.body, {
    headers: {
      "Content-Disposition": `attachment; filename="${sanitizeFileName(
        resumePdf.fileName,
      )}"`,
      "Content-Type": resumePdf.contentType ?? "application/pdf",
    },
  });
}

function sanitizeFileName(fileName: string) {
  return fileName.replace(/["\\/:*?<>|]+/g, "-");
}
