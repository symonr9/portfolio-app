export type ContentfulContentType =
  | "profile"
  | "workSample"
  | "blogPost"
  | "experience"
  | "expertiseTag"
  | "testimonial"
  | "siteSettings";

export type WorkSampleType =
  | "publishing"
  | "social-media"
  | "writing"
  | "photography"
  | "art";

export type ExperienceCategory =
  | "work"
  | "education"
  | "certification"
  | "volunteer"
  | "award"
  | "other";

export type ExpertiseCategory =
  | "skill"
  | "industry"
  | "medium"
  | "platform"
  | "tool"
  | "audience"
  | "other";

export type ContentfulLocaleFields<TFields> = {
  [Field in keyof TFields]: {
    [locale: string]: TFields[Field];
  };
};

export interface ContentfulSys {
  id: string;
  type: string;
  createdAt?: string;
  updatedAt?: string;
  locale?: string;
  contentType?: {
    sys: {
      id: ContentfulContentType | string;
      linkType: "ContentType";
      type: "Link";
    };
  };
}

export interface ContentfulLink<
  LinkType extends "Entry" | "Asset" = "Entry" | "Asset",
> {
  sys: {
    id: string;
    linkType: LinkType;
    type: "Link";
  };
}

export interface ContentfulEntry<TFields, TContentType extends string = string> {
  sys: ContentfulSys & {
    contentType: {
      sys: {
        id: TContentType;
        linkType: "ContentType";
        type: "Link";
      };
    };
  };
  fields: TFields;
}

export interface ContentfulAsset {
  sys: ContentfulSys;
  fields: {
    title?: string;
    description?: string;
    file?: {
      url: string;
      details?: {
        size?: number;
        image?: {
          width: number;
          height: number;
        };
      };
      fileName: string;
      contentType: string;
    };
  };
}

export type ContentfulReference<TEntry> =
  | TEntry
  | ContentfulLink<"Entry">;

export type ContentfulAssetReference = ContentfulAsset | ContentfulLink<"Asset">;

export interface RichTextMark {
  type: string;
}

export interface RichTextNode {
  nodeType: string;
  data: Record<string, unknown>;
  content?: RichTextNode[];
  marks?: RichTextMark[];
  value?: string;
}

export interface RichTextDocument extends RichTextNode {
  nodeType: "document";
  content: RichTextNode[];
}

export interface SocialLink {
  label: string;
  url: string;
}

export interface NavigationItem {
  label: string;
  href: string;
}

export interface ProfileFields {
  name: string;
  headline: string;
  smallHeadline?: string;
  shortBio: string;
  longBio?: RichTextDocument;
  portrait?: ContentfulAssetReference;
  avatar?: ContentfulAssetReference;
  email?: string;
  location?: string;
  resumePdf?: ContentfulAssetReference;
  socialLinks?: SocialLink[];
  featuredExpertise?: ContentfulReference<ExpertiseTagEntry>[];
  seoTitle?: string;
  seoDescription?: string;
}

export interface WorkSampleFields {
  title: string;
  slug: string;
  summary: string;
  type: WorkSampleType | string;
  organization?: string;
  role?: string;
  publishDate?: string;
  featuredImage?: ContentfulAssetReference;
  gallery?: ContentfulAssetReference[];
  videoUrl?: string;
  embedUrl?: string;
  externalUrl?: string;
  body?: RichTextDocument;
  beforeText?: string;
  afterText?: string;
  outcome?: string;
  tags?: ContentfulReference<ExpertiseTagEntry>[];
  featured?: boolean;
  sortOrder?: number;
  seoTitle?: string;
  seoDescription?: string;
}

export interface BlogPostFields {
  title: string;
  slug: string;
  excerpt: string;
  publishDate: string;
  updatedDate?: string;
  coverImage?: ContentfulAssetReference;
  body: RichTextDocument;
  author?: ContentfulReference<ProfileEntry>;
  tags?: ContentfulReference<ExpertiseTagEntry>[];
  relatedWorkSamples?: ContentfulReference<WorkSampleEntry>[];
  seoTitle?: string;
  seoDescription?: string;
}

export interface ExperienceFields {
  title: string;
  organization?: string;
  location?: string;
  startDate?: string;
  endDate?: string;
  current?: boolean;
  description?: string;
  achievements?: string[];
  skillsUsed?: ContentfulReference<ExpertiseTagEntry>[];
  organizationUrl?: string;
  category?: ExperienceCategory | string;
  sortOrder?: number;
}

export interface ExpertiseTagFields {
  name: string;
  slug: string;
  description?: string;
  category?: ExpertiseCategory | string;
  featured?: boolean;
  sortOrder?: number;
}

export interface TestimonialFields {
  quote: string;
  personName: string;
  personTitle?: string;
  organization?: string;
  avatar?: ContentfulAssetReference;
  relatedWorkSample?: ContentfulReference<WorkSampleEntry>;
  featured?: boolean;
  sortOrder?: number;
}

export interface SiteSettingsFields {
  siteTitle: string;
  siteDescription?: string;
  navigation?: NavigationItem[];
  homepageFeaturedWork?: ContentfulReference<WorkSampleEntry>[];
  homepageFeaturedPosts?: ContentfulReference<BlogPostEntry>[];
  contactCta?: string;
  defaultSeoImage?: ContentfulAssetReference;
}

export type ProfileEntry = ContentfulEntry<ProfileFields, "profile">;
export type WorkSampleEntry = ContentfulEntry<WorkSampleFields, "workSample">;
export type BlogPostEntry = ContentfulEntry<BlogPostFields, "blogPost">;
export type ExperienceEntry = ContentfulEntry<ExperienceFields, "experience">;
export type ExpertiseTagEntry = ContentfulEntry<
  ExpertiseTagFields,
  "expertiseTag"
>;
export type TestimonialEntry = ContentfulEntry<
  TestimonialFields,
  "testimonial"
>;
export type SiteSettingsEntry = ContentfulEntry<
  SiteSettingsFields,
  "siteSettings"
>;

export interface ContentfulEntryMap {
  profile: ProfileEntry;
  workSample: WorkSampleEntry;
  blogPost: BlogPostEntry;
  experience: ExperienceEntry;
  expertiseTag: ExpertiseTagEntry;
  testimonial: TestimonialEntry;
  siteSettings: SiteSettingsEntry;
}

export interface ContentfulCollection<TItem> {
  sys: {
    type: "Array";
  };
  total: number;
  skip: number;
  limit: number;
  items: TItem[];
  includes?: {
    Entry?: ContentfulEntry<unknown>[];
    Asset?: ContentfulAsset[];
  };
}
