import type {
  BlogPostEntry,
  ContentfulCollection,
  ContentfulContentType,
  ContentfulEntryMap,
  ContentfulAsset,
  ContentfulAssetReference,
  ContentfulEntry,
  ContentfulReference,
  ExperienceEntry,
  ExpertiseTagEntry,
  ProfileEntry,
  SiteSettingsEntry,
  TestimonialEntry,
  WorkSampleEntry,
} from "./types";

type ContentfulQueryValue =
  | string
  | number
  | boolean
  | readonly (string | number | boolean)[]
  | undefined;

export type ContentfulQuery = Record<string, ContentfulQueryValue>;

type ContentfulFetchInit = RequestInit & {
  next?: {
    revalidate?: false | 0 | number;
    tags?: string[];
  };
};

interface ContentfulConfig {
  accessToken: string;
  apiHost: string;
  environment: string;
  revalidate: false | 0 | number;
  spaceId: string;
}

export interface ContentfulRequestOptions {
  preview?: boolean;
  revalidate?: false | 0 | number;
  tags?: string[];
}

const CONTENTFUL_API_HOST = "https://cdn.contentful.com";
const CONTENTFUL_PREVIEW_API_HOST = "https://preview.contentful.com";
const DEFAULT_ENVIRONMENT = "master";
const DEFAULT_REVALIDATE_SECONDS = 300;
const PAGE_SIZE = 100;

const defaultOrderByContentType = {
  blogPost: "-fields.publishDate",
  experience: "fields.sortOrder,-fields.startDate",
  expertiseTag: "fields.sortOrder,fields.name",
  profile: "-sys.updatedAt",
  siteSettings: "-sys.updatedAt",
  testimonial: "fields.sortOrder,-sys.updatedAt",
  workSample: "fields.sortOrder,-fields.publishDate",
} satisfies Record<ContentfulContentType, string>;

export function isContentfulConfigured(preview = false) {
  return Boolean(
    process.env.CONTENTFUL_SPACE_ID &&
      (preview
        ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
        : process.env.CONTENTFUL_ACCESS_TOKEN),
  );
}

export function getContentfulConfig(preview = false): ContentfulConfig {
  const spaceId = process.env.CONTENTFUL_SPACE_ID;
  const accessToken = preview
    ? process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN
    : process.env.CONTENTFUL_ACCESS_TOKEN;

  if (!spaceId || !accessToken) {
    const tokenName = preview
      ? "CONTENTFUL_PREVIEW_ACCESS_TOKEN"
      : "CONTENTFUL_ACCESS_TOKEN";

    throw new Error(
      `Missing Contentful environment variables. Set CONTENTFUL_SPACE_ID and ${tokenName}.`,
    );
  }

  return {
    accessToken,
    apiHost: preview ? CONTENTFUL_PREVIEW_API_HOST : CONTENTFUL_API_HOST,
    environment: process.env.CONTENTFUL_ENVIRONMENT ?? DEFAULT_ENVIRONMENT,
    revalidate: getRevalidateSeconds(),
    spaceId,
  };
}

export async function contentfulFetch<TResponse>(
  path: string,
  query: ContentfulQuery = {},
  options: ContentfulRequestOptions = {},
) {
  const config = getContentfulConfig(options.preview);
  const url = buildContentfulUrl(config, path, query);
  const fetchOptions: ContentfulFetchInit = {
    headers: {
      Authorization: `Bearer ${config.accessToken}`,
      "Content-Type": "application/json",
    },
    next: {
      revalidate: options.revalidate ?? config.revalidate,
      tags: ["contentful", ...(options.tags ?? [])],
    },
  };

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    const message = await readErrorMessage(response);

    throw new Error(
      `Contentful request failed: ${response.status} ${response.statusText}${message}`,
    );
  }

  return (await response.json()) as TResponse;
}

export async function getEntries<TContentType extends ContentfulContentType>(
  contentType: TContentType,
  query: ContentfulQuery = {},
  options: ContentfulRequestOptions = {},
) {
  return contentfulFetch<ContentfulCollection<ContentfulEntryMap[TContentType]>>(
    "/entries",
    {
      include: 2,
      order: defaultOrderByContentType[contentType],
      ...query,
      content_type: contentType,
    },
    withContentfulTag(contentType, options),
  );
}

export async function getAllEntries<TContentType extends ContentfulContentType>(
  contentType: TContentType,
  query: ContentfulQuery = {},
  options: ContentfulRequestOptions = {},
) {
  const entries: ContentfulEntryMap[TContentType][] = [];
  let skip = 0;
  let total = 0;

  do {
    const page = await getEntries(
      contentType,
      { limit: PAGE_SIZE, ...query, skip },
      options,
    );

    entries.push(...page.items);
    total = page.total;
    skip += page.limit;
  } while (entries.length < total);

  return entries;
}

export async function getEntryById<TContentType extends ContentfulContentType>(
  contentType: TContentType,
  entryId: string,
  options: ContentfulRequestOptions = {},
) {
  const entry = await contentfulFetch<ContentfulEntryMap[TContentType]>(
    `/entries/${entryId}`,
    {},
    withContentfulTag(contentType, options),
  );

  if (entry.sys.contentType.sys.id !== contentType) {
    throw new Error(
      `Expected Contentful entry ${entryId} to be ${contentType}, received ${entry.sys.contentType.sys.id}.`,
    );
  }

  return entry;
}

export async function getEntryBySlug<
  TContentType extends Extract<ContentfulContentType, "blogPost" | "workSample">,
>(
  contentType: TContentType,
  slug: string,
  options: ContentfulRequestOptions = {},
) {
  const collection = await getEntries(
    contentType,
    {
      "fields.slug": slug,
      limit: 1,
    },
    options,
  );

  return collection.items[0] ?? null;
}

export async function getSlugParams<
  TContentType extends Extract<ContentfulContentType, "blogPost" | "workSample">,
>(contentType: TContentType, options: ContentfulRequestOptions = {}) {
  const entries = await getAllEntries(
    contentType,
    {
      select: "fields.slug",
    },
    options,
  );

  return entries.map(({ fields }) => ({ slug: fields.slug }));
}

export async function getSingletonEntry<
  TContentType extends Extract<ContentfulContentType, "profile" | "siteSettings">,
>(contentType: TContentType, options: ContentfulRequestOptions = {}) {
  const collection = await getEntries(
    contentType,
    {
      limit: 1,
    },
    options,
  );

  return collection.items[0] ?? null;
}

export function getProfile(options?: ContentfulRequestOptions) {
  return getSingletonEntry("profile", options) as Promise<ProfileEntry | null>;
}

export function getSiteSettings(options?: ContentfulRequestOptions) {
  return getSingletonEntry("siteSettings", options) as Promise<
    SiteSettingsEntry | null
  >;
}

export function getWorkSamples(
  query: ContentfulQuery = {},
  options?: ContentfulRequestOptions,
) {
  return getAllEntries("workSample", query, options) as Promise<
    WorkSampleEntry[]
  >;
}

export function getFeaturedWorkSamples(options?: ContentfulRequestOptions) {
  return getWorkSamples({ "fields.featured": true }, options);
}

export function getWorkSampleBySlug(
  slug: string,
  options?: ContentfulRequestOptions,
) {
  return getEntryBySlug("workSample", slug, options) as Promise<
    WorkSampleEntry | null
  >;
}

export function getWorkSampleSlugParams(options?: ContentfulRequestOptions) {
  return getSlugParams("workSample", options);
}

export function getBlogPosts(
  query: ContentfulQuery = {},
  options?: ContentfulRequestOptions,
) {
  return getAllEntries("blogPost", query, options) as Promise<BlogPostEntry[]>;
}

export function getBlogPostBySlug(
  slug: string,
  options?: ContentfulRequestOptions,
) {
  return getEntryBySlug("blogPost", slug, options) as Promise<
    BlogPostEntry | null
  >;
}

export function getBlogPostSlugParams(options?: ContentfulRequestOptions) {
  return getSlugParams("blogPost", options);
}

export function getExperiences(
  query: ContentfulQuery = {},
  options?: ContentfulRequestOptions,
) {
  return getAllEntries("experience", query, options) as Promise<
    ExperienceEntry[]
  >;
}

export function getExpertiseTags(
  query: ContentfulQuery = {},
  options?: ContentfulRequestOptions,
) {
  return getAllEntries("expertiseTag", query, options) as Promise<
    ExpertiseTagEntry[]
  >;
}

export function getFeaturedExpertiseTags(options?: ContentfulRequestOptions) {
  return getExpertiseTags({ "fields.featured": true }, options);
}

export function getTestimonials(
  query: ContentfulQuery = {},
  options?: ContentfulRequestOptions,
) {
  return getAllEntries("testimonial", query, options) as Promise<
    TestimonialEntry[]
  >;
}

export function getFeaturedTestimonials(options?: ContentfulRequestOptions) {
  return getTestimonials({ "fields.featured": true }, options);
}

export function isResolvedEntry<TFields, TContentType extends string>(
  reference:
    | ContentfulReference<ContentfulEntry<TFields, TContentType>>
    | undefined,
): reference is ContentfulEntry<TFields, TContentType> {
  return Boolean(
    reference &&
      "fields" in reference &&
      reference.sys.type === "Entry" &&
      reference.sys.contentType,
  );
}

export function isResolvedAsset(
  reference: ContentfulAssetReference | undefined,
): reference is ContentfulAsset {
  return Boolean(
    reference && "fields" in reference && reference.sys.type === "Asset",
  );
}

export function getAssetUrl(asset: ContentfulAssetReference | undefined) {
  if (!isResolvedAsset(asset)) {
    return null;
  }

  const fileUrl = asset.fields.file?.url;

  if (!fileUrl) {
    return null;
  }

  return fileUrl.startsWith("//") ? `https:${fileUrl}` : fileUrl;
}

function buildContentfulUrl(
  config: ContentfulConfig,
  path: string,
  query: ContentfulQuery,
) {
  const url = new URL(
    `/spaces/${config.spaceId}/environments/${config.environment}${path}`,
    config.apiHost,
  );

  for (const [key, value] of Object.entries(query)) {
    if (value === undefined) {
      continue;
    }

    const queryValue = Array.isArray(value) ? value.join(",") : String(value);
    url.searchParams.set(key, queryValue);
  }

  return url;
}

function getRevalidateSeconds() {
  const value = process.env.CONTENTFUL_REVALIDATE_SECONDS;

  if (!value) {
    return DEFAULT_REVALIDATE_SECONDS;
  }

  if (value === "false") {
    return false;
  }

  const seconds = Number(value);

  if (!Number.isFinite(seconds) || seconds < 0) {
    throw new Error(
      "CONTENTFUL_REVALIDATE_SECONDS must be a non-negative number or false.",
    );
  }

  return seconds;
}

function withContentfulTag(
  contentType: ContentfulContentType,
  options: ContentfulRequestOptions,
): ContentfulRequestOptions {
  return {
    ...options,
    tags: [`contentful:${contentType}`, ...(options.tags ?? [])],
  };
}

async function readErrorMessage(response: Response) {
  try {
    const body = (await response.json()) as { message?: string };
    return body.message ? ` - ${body.message}` : "";
  } catch {
    return "";
  }
}
