import { draftMode } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import {
  getBlogPostBySlug,
  getWorkSampleBySlug,
  isContentfulConfigured,
} from "@/lib/contentful";

const STATIC_PREVIEW_PATHS = new Set([
  "/",
  "/about",
  "/blog",
  "/contact",
  "/resume",
  "/work",
  "/writing",
]);

export async function GET(request: NextRequest) {
  const secret = process.env.CONTENTFUL_PREVIEW_SECRET;
  const requestSecret = request.nextUrl.searchParams.get("secret");
  const slug = request.nextUrl.searchParams.get("slug");

  if (!secret) {
    return Response.json(
      { enabled: false, message: "Missing CONTENTFUL_PREVIEW_SECRET." },
      { status: 500 },
    );
  }

  if (requestSecret !== secret || !slug) {
    return Response.json(
      { enabled: false, message: "Invalid preview secret or slug." },
      { status: 401 },
    );
  }

  if (!isContentfulConfigured(true)) {
    return Response.json(
      {
        enabled: false,
        message:
          "Missing Contentful preview configuration. Set CONTENTFUL_SPACE_ID and CONTENTFUL_PREVIEW_ACCESS_TOKEN.",
      },
      { status: 500 },
    );
  }

  const path = await getValidatedPreviewPath(slug);

  if (!path) {
    return Response.json(
      { enabled: false, message: "Invalid preview slug." },
      { status: 401 },
    );
  }

  const draft = await draftMode();
  draft.enable();

  redirect(path);
}

async function getValidatedPreviewPath(slug: string) {
  const previewPath = normalizePreviewPath(slug);

  if (!previewPath) {
    return null;
  }

  if (STATIC_PREVIEW_PATHS.has(previewPath.pathname)) {
    return previewPath.href;
  }

  const workSlug = previewPath.pathname.match(/^\/work\/([^/]+)$/)?.[1];

  if (workSlug) {
    const sample = await getWorkSampleBySlug(workSlug, {
      preview: true,
      revalidate: 0,
    });

    return sample ? `/work/${sample.slug}${previewPath.search}` : null;
  }

  const blogSlug = previewPath.pathname.match(/^\/blog\/([^/]+)$/)?.[1];

  if (blogSlug) {
    const post = await getBlogPostBySlug(blogSlug, {
      preview: true,
      revalidate: 0,
    });

    return post ? `/blog/${post.slug}${previewPath.search}` : null;
  }

  return null;
}

function normalizePreviewPath(slug: string) {
  let path = slug.trim();

  if (!path) {
    return null;
  }

  if (!path.startsWith("/")) {
    path = `/${path}`;
  }

  if (path.startsWith("//")) {
    return null;
  }

  try {
    const url = new URL(path, "https://preview.local");

    if (url.origin !== "https://preview.local") {
      return null;
    }

    return {
      href: `${url.pathname}${url.search}`,
      pathname: url.pathname,
      search: url.search,
    };
  } catch {
    return null;
  }
}
