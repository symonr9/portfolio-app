import type { Metadata } from "next";

export const siteName = "Portfolio";
export const defaultTitle = "Portfolio";
export const defaultDescription =
  "A flexible personal portfolio for profile details, work samples, writing, experience, and ways to connect.";

export function getSiteUrl() {
  const rawUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.URL ??
    process.env.DEPLOY_PRIME_URL ??
    "http://localhost:3000";

  const url = new URL(rawUrl);
  url.pathname = "";
  url.search = "";
  url.hash = "";

  return url;
}

export function absoluteUrl(path = "/") {
  return new URL(path, getSiteUrl()).toString();
}

export function buildPageMetadata({
  description,
  image,
  path = "/",
  title,
  type = "website",
}: {
  description: string;
  image?: string | null;
  path?: string;
  title: string;
  type?: "article" | "profile" | "website";
}): Metadata {
  const url = absoluteUrl(path);
  const images = image ? [{ url: image }] : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      title,
      description,
      siteName,
      type,
      url,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}
