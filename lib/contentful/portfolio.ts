import { contentfulGraphQLFetch } from "./graphql";
import type { ContentfulRequestOptions } from "./graphql";

export type Tag = {
  name: string;
  slug: string;
};

export type ContentfulImage = {
  id: string;
  url: string;
  title: string;
  description: string | null;
  width: number;
  height: number;
  contentType: string | null;
};

export type RichTextMark = {
  type?: string;
};

export type RichTextNode = {
  nodeType?: string;
  content?: RichTextNode[];
  value?: string;
  marks?: RichTextMark[];
  data?: {
    target?: {
      sys?: {
        id?: string;
      };
    };
    uri?: string;
  };
};

export type RichTextDocument = {
  json: RichTextNode | null;
  links: {
    assets: ContentfulImage[];
  };
};

export type Profile = {
  name: string;
  headline: string;
  shortBio: string;
  longBio: RichTextDocument | null;
  email: string | null;
  location: string | null;
  portrait: ContentfulImage | null;
};

export type WorkSample = {
  title: string;
  slug: string;
  summary: string;
  type: string;
  organization: string | null;
  role: string | null;
  publishDate: string | null;
  featured: boolean;
  tags: Tag[];
  featuredImage: ContentfulImage | null;
  gallery: ContentfulImage[];
  videoUrl: string | null;
  embedUrl: string | null;
  body: RichTextDocument | null;
  beforeText: string | null;
  afterText: string | null;
  outcome: string | null;
  externalUrl: string | null;
};

export type BlogPost = {
  title: string;
  slug: string;
  excerpt: string;
  publishDate: string;
  readingTime: string;
  tags: Tag[];
  coverImage: ContentfulImage | null;
  body: RichTextDocument | null;
  relatedWorkSamples: Pick<WorkSample, "title" | "slug" | "summary">[];
};

export type Experience = {
  title: string;
  organization: string | null;
  location: string | null;
  startDate: string | null;
  endDate: string | null;
  current: boolean;
  category: string | null;
  description: string | null;
  achievements: string[];
  skillsUsed: Tag[];
};

type RichTextField = {
  json?: RichTextNode | null;
  links?: {
    assets?: {
      block?: AssetItem[] | null;
    } | null;
  } | null;
} | null;

type TagItem = {
  name?: string | null;
  slug?: string | null;
} | null;

type AssetItem = {
  sys?: {
    id?: string | null;
  } | null;
  url?: string | null;
  title?: string | null;
  description?: string | null;
  width?: number | null;
  height?: number | null;
  contentType?: string | null;
} | null;

type WorkSampleItem = {
  title?: string | null;
  slug?: string | null;
  summary?: string | null;
  type?: string | null;
  organization?: string | null;
  role?: string | null;
  publishDate?: string | null;
  featured?: boolean | null;
  featuredImage?: AssetItem;
  galleryCollection?: {
    items?: AssetItem[] | null;
  } | null;
  videoUrl?: string | null;
  embedUrl?: string | null;
  body?: RichTextField;
  beforeText?: string | null;
  afterText?: string | null;
  outcome?: string | null;
  externalUrl?: string | null;
  tagsCollection?: {
    items?: TagItem[] | null;
  } | null;
} | null;

type BlogPostItem = {
  title?: string | null;
  slug?: string | null;
  excerpt?: string | null;
  publishDate?: string | null;
  coverImage?: AssetItem;
  body?: RichTextField;
  tagsCollection?: {
    items?: TagItem[] | null;
  } | null;
  relatedWorkSamplesCollection?: {
    items?: WorkSampleItem[] | null;
  } | null;
} | null;

type ProfileItem = {
  name?: string | null;
  headline?: string | null;
  shortBio?: string | null;
  longBio?: RichTextField;
  portrait?: AssetItem;
  email?: string | null;
  location?: string | null;
} | null;

type ExperienceItem = {
  title?: string | null;
  organization?: string | null;
  location?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  current?: boolean | null;
  category?: string | null;
  description?: string | null;
  achievements?: string[] | null;
  skillsUsedCollection?: {
    items?: TagItem[] | null;
  } | null;
} | null;

const TAG_FIELDS = `
  name
  slug
`;

const ASSET_FIELDS = `
  sys {
    id
  }
  url
  title
  description
  width
  height
  contentType
`;

const RICH_TEXT_FIELDS = `
  json
  links {
    assets {
      block {
        ${ASSET_FIELDS}
      }
    }
  }
`;

const WORK_CARD_FIELDS = `
  title
  slug
  summary
  type
  organization
  role
  publishDate
  featured
  featuredImage {
    ${ASSET_FIELDS}
  }
  tagsCollection(limit: 8, preview: $preview) {
    items {
      ${TAG_FIELDS}
    }
  }
`;

const WORK_DETAIL_FIELDS = `
  ${WORK_CARD_FIELDS}
  galleryCollection(limit: 12, preview: $preview) {
    items {
      ${ASSET_FIELDS}
    }
  }
  videoUrl
  embedUrl
  body {
    ${RICH_TEXT_FIELDS}
  }
  beforeText
  afterText
  outcome
  externalUrl
`;

const BLOG_CARD_FIELDS = `
  title
  slug
  excerpt
  publishDate
  coverImage {
    ${ASSET_FIELDS}
  }
  body {
    ${RICH_TEXT_FIELDS}
  }
  tagsCollection(limit: 8, preview: $preview) {
    items {
      ${TAG_FIELDS}
    }
  }
`;

const HOME_QUERY = `
  query PortfolioHome($preview: Boolean!) {
    profileCollection(limit: 1, order: sys_updatedAt_DESC, preview: $preview) {
      items {
        name
        headline
        shortBio
        longBio {
          ${RICH_TEXT_FIELDS}
        }
        portrait {
          ${ASSET_FIELDS}
        }
        email
        location
      }
    }
    workSampleCollection(
      limit: 3
      order: [sortOrder_ASC, publishDate_DESC]
      where: { featured: true }
      preview: $preview
    ) {
      items {
        ${WORK_CARD_FIELDS}
      }
    }
    blogPostCollection(limit: 2, order: publishDate_DESC, preview: $preview) {
      items {
        ${BLOG_CARD_FIELDS}
      }
    }
    expertiseTagCollection(limit: 12, order: [sortOrder_ASC, name_ASC], preview: $preview) {
      items {
        ${TAG_FIELDS}
      }
    }
  }
`;

const WORK_SAMPLES_QUERY = `
  query WorkSamples($preview: Boolean!) {
    workSampleCollection(limit: 100, order: [sortOrder_ASC, publishDate_DESC], preview: $preview) {
      items {
        ${WORK_CARD_FIELDS}
      }
    }
  }
`;

const WORK_SAMPLE_QUERY = `
  query WorkSample($slug: String!, $preview: Boolean!) {
    workSampleCollection(limit: 1, where: { slug: $slug }, preview: $preview) {
      items {
        ${WORK_DETAIL_FIELDS}
      }
    }
  }
`;

const BLOG_POSTS_QUERY = `
  query BlogPosts($preview: Boolean!) {
    blogPostCollection(limit: 100, order: publishDate_DESC, preview: $preview) {
      items {
        ${BLOG_CARD_FIELDS}
      }
    }
  }
`;

const BLOG_POST_QUERY = `
  query BlogPost($slug: String!, $preview: Boolean!) {
    blogPostCollection(limit: 1, where: { slug: $slug }, preview: $preview) {
      items {
        ${BLOG_CARD_FIELDS}
        relatedWorkSamplesCollection(limit: 4, preview: $preview) {
          items {
            title
            slug
            summary
          }
        }
      }
    }
  }
`;

const ABOUT_QUERY = `
  query PortfolioAbout($preview: Boolean!) {
    profileCollection(limit: 1, order: sys_updatedAt_DESC, preview: $preview) {
      items {
        name
        headline
        shortBio
        longBio {
          ${RICH_TEXT_FIELDS}
        }
        portrait {
          ${ASSET_FIELDS}
        }
        email
        location
      }
    }
    experienceCollection(limit: 2, order: [sortOrder_ASC, startDate_DESC], preview: $preview) {
      items {
        title
        organization
        location
        startDate
        endDate
        current
        category
        description
        achievements
        skillsUsedCollection(limit: 8, preview: $preview) {
          items {
            ${TAG_FIELDS}
          }
        }
      }
    }
  }
`;

const RESUME_QUERY = `
  query PortfolioResume($preview: Boolean!) {
    profileCollection(limit: 1, order: sys_updatedAt_DESC, preview: $preview) {
      items {
        name
        headline
        shortBio
        longBio {
          ${RICH_TEXT_FIELDS}
        }
        portrait {
          ${ASSET_FIELDS}
        }
        email
        location
      }
    }
    experienceCollection(limit: 100, order: [sortOrder_ASC, startDate_DESC], preview: $preview) {
      items {
        title
        organization
        location
        startDate
        endDate
        current
        category
        description
        achievements
        skillsUsedCollection(limit: 8, preview: $preview) {
          items {
            ${TAG_FIELDS}
          }
        }
      }
    }
    expertiseTagCollection(limit: 100, order: [sortOrder_ASC, name_ASC], preview: $preview) {
      items {
        ${TAG_FIELDS}
      }
    }
  }
`;

const CONTACT_QUERY = `
  query PortfolioContact($preview: Boolean!) {
    profileCollection(limit: 1, order: sys_updatedAt_DESC, preview: $preview) {
      items {
        name
        headline
        shortBio
        longBio {
          ${RICH_TEXT_FIELDS}
        }
        portrait {
          ${ASSET_FIELDS}
        }
        email
        location
      }
    }
    siteSettingsCollection(limit: 1, order: sys_updatedAt_DESC, preview: $preview) {
      items {
        contactCta
      }
    }
  }
`;

export async function getHomePageData(options?: ContentfulRequestOptions) {
  const data = await contentfulGraphQLFetch<{
    profileCollection?: { items?: ProfileItem[] | null } | null;
    workSampleCollection?: { items?: WorkSampleItem[] | null } | null;
    blogPostCollection?: { items?: BlogPostItem[] | null } | null;
    expertiseTagCollection?: { items?: TagItem[] | null } | null;
  }>(HOME_QUERY, {}, options);

  return {
    profile: firstProfile(data.profileCollection?.items),
    featuredWork: mapWorkSamples(data.workSampleCollection?.items),
    featuredPosts: mapBlogPosts(data.blogPostCollection?.items),
    expertiseTags: mapTags(data.expertiseTagCollection?.items),
  };
}

export async function getWorkSamples(options?: ContentfulRequestOptions) {
  const data = await contentfulGraphQLFetch<{
    workSampleCollection?: { items?: WorkSampleItem[] | null } | null;
  }>(WORK_SAMPLES_QUERY, {}, options);

  return mapWorkSamples(data.workSampleCollection?.items);
}

export async function getWorkSampleBySlug(
  slug: string,
  options?: ContentfulRequestOptions,
) {
  const data = await contentfulGraphQLFetch<{
    workSampleCollection?: { items?: WorkSampleItem[] | null } | null;
  }>(WORK_SAMPLE_QUERY, { slug }, options);

  return mapWorkSamples(data.workSampleCollection?.items)[0] ?? null;
}

export async function getWorkSampleSlugParams(
  options?: ContentfulRequestOptions,
) {
  const samples = await getWorkSamples(options);
  return samples.map((sample) => ({ slug: sample.slug }));
}

export async function getBlogPosts(options?: ContentfulRequestOptions) {
  const data = await contentfulGraphQLFetch<{
    blogPostCollection?: { items?: BlogPostItem[] | null } | null;
  }>(BLOG_POSTS_QUERY, {}, options);

  return mapBlogPosts(data.blogPostCollection?.items);
}

export async function getBlogPostBySlug(
  slug: string,
  options?: ContentfulRequestOptions,
) {
  const data = await contentfulGraphQLFetch<{
    blogPostCollection?: { items?: BlogPostItem[] | null } | null;
  }>(BLOG_POST_QUERY, { slug }, options);

  return mapBlogPosts(data.blogPostCollection?.items)[0] ?? null;
}

export async function getBlogPostSlugParams(options?: ContentfulRequestOptions) {
  const posts = await getBlogPosts(options);
  return posts.map((post) => ({ slug: post.slug }));
}

export async function getAboutPageData(options?: ContentfulRequestOptions) {
  const data = await contentfulGraphQLFetch<{
    profileCollection?: { items?: ProfileItem[] | null } | null;
    experienceCollection?: { items?: ExperienceItem[] | null } | null;
  }>(ABOUT_QUERY, {}, options);

  return {
    profile: firstProfile(data.profileCollection?.items),
    experiences: mapExperiences(data.experienceCollection?.items),
  };
}

export async function getResumePageData(options?: ContentfulRequestOptions) {
  const data = await contentfulGraphQLFetch<{
    profileCollection?: { items?: ProfileItem[] | null } | null;
    experienceCollection?: { items?: ExperienceItem[] | null } | null;
    expertiseTagCollection?: { items?: TagItem[] | null } | null;
  }>(RESUME_QUERY, {}, options);

  return {
    profile: firstProfile(data.profileCollection?.items),
    experiences: mapExperiences(data.experienceCollection?.items),
    expertiseTags: mapTags(data.expertiseTagCollection?.items),
  };
}

export async function getContactPageData(options?: ContentfulRequestOptions) {
  const data = await contentfulGraphQLFetch<{
    profileCollection?: { items?: ProfileItem[] | null } | null;
    siteSettingsCollection?: {
      items?: ({ contactCta?: string | null } | null)[] | null;
    } | null;
  }>(CONTACT_QUERY, {}, options);

  return {
    profile: firstProfile(data.profileCollection?.items),
    contactCta:
      data.siteSettingsCollection?.items?.find(Boolean)?.contactCta ?? null,
  };
}

function firstProfile(items?: ProfileItem[] | null): Profile {
  const item = items?.find(Boolean);

  if (!item?.name || !item.headline || !item.shortBio) {
    throw new Error("Contentful profile entry is missing required fields.");
  }

  const longBio = normalizeRichText(item.longBio);

  return {
    name: item.name,
    headline: item.headline,
    shortBio: item.shortBio,
    longBio,
    email: item.email ?? null,
    location: item.location ?? null,
    portrait: mapAsset(item.portrait),
  };
}

function mapWorkSamples(items?: WorkSampleItem[] | null): WorkSample[] {
  return (items ?? []).flatMap((item) => {
    if (!item?.title || !item.slug || !item.summary || !item.type) {
      return [];
    }

    return [
      {
        title: item.title,
        slug: item.slug,
        summary: item.summary,
        type: item.type,
        organization: item.organization ?? null,
        role: item.role ?? null,
        publishDate: item.publishDate ?? null,
        featured: Boolean(item.featured),
        tags: mapTags(item.tagsCollection?.items),
        featuredImage: mapAsset(item.featuredImage),
        gallery: mapAssets(item.galleryCollection?.items),
        videoUrl: item.videoUrl ?? null,
        embedUrl: item.embedUrl ?? null,
        body: normalizeRichText(item.body),
        beforeText: item.beforeText ?? null,
        afterText: item.afterText ?? null,
        outcome: item.outcome ?? null,
        externalUrl: item.externalUrl ?? null,
      },
    ];
  });
}

function mapBlogPosts(items?: BlogPostItem[] | null): BlogPost[] {
  return (items ?? []).flatMap((item) => {
    if (!item?.title || !item.slug || !item.excerpt || !item.publishDate) {
      return [];
    }

    const body = normalizeRichText(item.body);

    return [
      {
        title: item.title,
        slug: item.slug,
        excerpt: item.excerpt,
        publishDate: item.publishDate,
        readingTime: getReadingTime(body),
        tags: mapTags(item.tagsCollection?.items),
        coverImage: mapAsset(item.coverImage),
        body,
        relatedWorkSamples: mapWorkSamples(
          item.relatedWorkSamplesCollection?.items,
        ).map(({ title, slug, summary }) => ({ title, slug, summary })),
      },
    ];
  });
}

function mapExperiences(items?: ExperienceItem[] | null): Experience[] {
  return (items ?? []).flatMap((item) => {
    if (!item?.title) {
      return [];
    }

    return [
      {
        title: item.title,
        organization: item.organization ?? null,
        location: item.location ?? null,
        startDate: item.startDate ?? null,
        endDate: item.endDate ?? null,
        current: Boolean(item.current),
        category: item.category ?? null,
        description: item.description ?? null,
        achievements: item.achievements ?? [],
        skillsUsed: mapTags(item.skillsUsedCollection?.items),
      },
    ];
  });
}

function mapTags(items?: TagItem[] | null): Tag[] {
  return (items ?? []).flatMap((item) => {
    if (!item?.name || !item.slug) {
      return [];
    }

    return [{ name: item.name, slug: item.slug }];
  });
}

function mapAssets(items?: AssetItem[] | null): ContentfulImage[] {
  return (items ?? []).flatMap((item) => {
    const asset = mapAsset(item);
    return asset ? [asset] : [];
  });
}

function mapAsset(item?: AssetItem): ContentfulImage | null {
  if (!item?.sys?.id || !item.url || !item.title || !item.width || !item.height) {
    return null;
  }

  return {
    id: item.sys.id,
    url: normalizeAssetUrl(item.url),
    title: item.title,
    description: item.description ?? null,
    width: item.width,
    height: item.height,
    contentType: item.contentType ?? null,
  };
}

function normalizeAssetUrl(url: string) {
  return url.startsWith("//") ? `https:${url}` : url;
}

function normalizeRichText(field?: RichTextField): RichTextDocument | null {
  if (!field?.json) {
    return null;
  }

  return {
    json: field.json,
    links: {
      assets: mapAssets(field.links?.assets?.block),
    },
  };
}

function richTextToParagraphs(field?: RichTextDocument | null): string[] {
  const root = field?.json;

  if (!root) {
    return [];
  }

  return (root.content ?? [])
    .map((node) => collectText(node).trim())
    .filter(Boolean);
}

function collectText(node: RichTextNode): string {
  if (node.value) {
    return node.value;
  }

  return (node.content ?? []).map(collectText).join("");
}

function getReadingTime(field: RichTextDocument | null) {
  const words = richTextToParagraphs(field)
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}
