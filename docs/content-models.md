# Contentful Content Models

This document defines the initial Contentful content model for a career-agnostic portfolio and resume site. The model is designed so the portfolio owner can manage content in Contentful while the Next.js application controls styling, layout, routing, and presentation.

## Modeling Principles

- Keep content reusable across professions, industries, and career paths.
- Prefer structured fields over presentation-specific fields.
- Use references for relationships such as tags, related work, and featured content.
- Use Contentful Assets for images, PDFs, and uploaded media.
- Store externally hosted videos as URLs or embed URLs unless there is a strong reason to upload video assets directly.
- Use slugs for public detail pages and stable URL generation.
- Include SEO fields only where page-specific metadata is useful.

## Content Types

### Profile

Purpose: A single entry that represents the portfolio owner and powers the home, about, resume, and contact surfaces.

Entry name: `Profile`
Content type ID: `profile`
Display field: `name`
Expected entries: one

Fields:

| Field | Field ID | Type | Required | Notes |
| --- | --- | --- | --- | --- |
| Name | `name` | Short text | Yes | Public display name. |
| Headline | `headline` | Short text | Yes | Brief positioning statement. Keep profession-agnostic in structure. |
| Small Headline | `smallHeadline` | Short text | No | Compact profile line for constrained surfaces such as the global navbar. |
| Short bio | `shortBio` | Long text | Yes | Concise summary for home and preview sections. |
| Long bio | `longBio` | Rich text | No | Full about-page biography. |
| Portrait | `portrait` | Media | No | Image asset. |
| Avatar | `avatar` | Media | No | Compact profile image for the global navbar and other small identity surfaces. |
| Email | `email` | Short text | No | Contact email. Validate as email. |
| Location | `location` | Short text | No | City, region, or remote-friendly phrase. |
| Resume PDF | `resumePdf` | Media | No | PDF asset for download. |
| Social links | `socialLinks` | JSON object | No | Array-like data for labels and URLs, or replace with a dedicated model later. |
| Featured expertise | `featuredExpertise` | References, many | No | Restrict to `expertiseTag`. |
| SEO title | `seoTitle` | Short text | No | Defaults to name/headline if empty. |
| SEO description | `seoDescription` | Long text | No | Defaults to short bio if empty. |

Recommended validations:

- Limit `headline` to 160 characters.
- Limit `smallHeadline` to 80 characters.
- Validate `email` as email.
- Restrict `portrait` to image file types.
- Restrict `avatar` to image file types.
- Restrict `resumePdf` to PDF.

### Work Sample

Purpose: A portfolio item representing completed work, case studies, media, projects, publications, presentations, or other professional examples.

Entry name: `Work Sample`
Content type ID: `workSample`
Display field: `title`

Fields:

| Field | Field ID | Type | Required | Notes |
| --- | --- | --- | --- | --- |
| Title | `title` | Short text | Yes | Public title. |
| Slug | `slug` | Short text | Yes | Unique URL slug. |
| Summary | `summary` | Long text | Yes | Used on cards and listing pages. |
| Type | `type` | Short text | Yes | Use validations for allowed categories. |
| Organization | `organization` | Short text | No | Client, employer, publication, brand, or project owner. |
| Role | `role` | Short text | No | Person's role on the work. |
| Publish date | `publishDate` | Date | No | Public or project date. |
| Featured image | `featuredImage` | Media | No | Primary visual. Restrict to images. |
| Gallery | `gallery` | Media, many | No | Supporting images or files. |
| Video URL | `videoUrl` | Short text | No | Public video URL. |
| Embed URL | `embedUrl` | Short text | No | Embed-safe URL when different from video URL. |
| External URL | `externalUrl` | Short text | No | Link to live work or source. |
| Body | `body` | Rich text | No | Detail page narrative. |
| Before text | `beforeText` | Long text | No | For revision, transformation, or comparison examples. |
| After text | `afterText` | Long text | No | For revision, transformation, or comparison examples. |
| Outcome | `outcome` | Long text | No | Results, impact, or reflection. |
| Tags | `tags` | References, many | No | Restrict to `expertiseTag`. |
| Featured | `featured` | Boolean | No | Used for home page and highlighted sections. |
| Sort order | `sortOrder` | Integer | No | Lower numbers appear first when manually ordered. |
| SEO title | `seoTitle` | Short text | No | Detail page metadata. |
| SEO description | `seoDescription` | Long text | No | Detail page metadata. |

Recommended validations:

- Require unique `slug`.
- Restrict `type` to a controlled list, such as `case-study`, `project`, `publication`, `media`, `presentation`, `research`, `event`, `other`.
- Restrict `featuredImage` to image file types.
- Validate URL fields as URLs.

### Blog Post

Purpose: Long-form articles authored for the site.

Entry name: `Blog Post`
Content type ID: `blogPost`
Display field: `title`

Fields:

| Field | Field ID | Type | Required | Notes |
| --- | --- | --- | --- | --- |
| Title | `title` | Short text | Yes | Public title. |
| Slug | `slug` | Short text | Yes | Unique URL slug. |
| Excerpt | `excerpt` | Long text | Yes | Listing and SEO fallback. |
| Publish date | `publishDate` | Date | Yes | Used for ordering and display. |
| Updated date | `updatedDate` | Date | No | Display when relevant. |
| Cover image | `coverImage` | Media | No | Image asset. |
| Body | `body` | Rich text | Yes | Article content. |
| Author | `author` | Reference | No | Restrict to `profile`; optional if there is only one profile. |
| Tags | `tags` | References, many | No | Restrict to `expertiseTag`. |
| Related work samples | `relatedWorkSamples` | References, many | No | Restrict to `workSample`. |
| SEO title | `seoTitle` | Short text | No | Defaults to title. |
| SEO description | `seoDescription` | Long text | No | Defaults to excerpt. |

Recommended validations:

- Require unique `slug`.
- Restrict `coverImage` to image file types.
- Limit `excerpt` to 240 characters.

### Experience

Purpose: Resume-style professional roles, education, volunteer work, certifications, or notable career entries.

Entry name: `Experience`
Content type ID: `experience`
Display field: `title`

Fields:

| Field | Field ID | Type | Required | Notes |
| --- | --- | --- | --- | --- |
| Title | `title` | Short text | Yes | Role, program, credential, or entry title. |
| Organization | `organization` | Short text | No | Company, institution, client, or group. |
| Location | `location` | Short text | No | Optional. |
| Start date | `startDate` | Date | No | Date can be month/year or exact, depending on Contentful settings. |
| End date | `endDate` | Date | No | Leave empty when current. |
| Current | `current` | Boolean | No | Indicates ongoing role or activity. |
| Description | `description` | Long text | No | Short role summary. |
| Achievements | `achievements` | Array of short text | No | Bullet points. |
| Skills used | `skillsUsed` | References, many | No | Restrict to `expertiseTag`. |
| Organization URL | `organizationUrl` | Short text | No | External link. |
| Category | `category` | Short text | No | Example: work, education, certification, volunteer, award. |
| Sort order | `sortOrder` | Integer | No | Lower numbers appear first. |

Recommended validations:

- Validate `organizationUrl` as URL.
- Restrict `category` to a controlled list if the resume page needs grouping.

### Expertise Tag

Purpose: Reusable taxonomy for filtering, grouping, and describing areas of expertise.

Entry name: `Expertise Tag`
Content type ID: `expertiseTag`
Display field: `name`

Fields:

| Field | Field ID | Type | Required | Notes |
| --- | --- | --- | --- | --- |
| Name | `name` | Short text | Yes | Public tag label. |
| Slug | `slug` | Short text | Yes | Unique URL/filter slug. |
| Description | `description` | Long text | No | Optional explainer. |
| Category | `category` | Short text | No | Example: skill, industry, medium, platform, tool, audience. |
| Featured | `featured` | Boolean | No | Highlight on home/about pages. |
| Sort order | `sortOrder` | Integer | No | Lower numbers appear first. |

Recommended validations:

- Require unique `slug`.
- Restrict `category` to a controlled list once real content patterns are known.

### Testimonial

Purpose: Optional social proof from collaborators, clients, managers, peers, or other references.

Entry name: `Testimonial`
Content type ID: `testimonial`
Display field: `personName`

Fields:

| Field | Field ID | Type | Required | Notes |
| --- | --- | --- | --- | --- |
| Quote | `quote` | Long text | Yes | Public quote. |
| Person name | `personName` | Short text | Yes | Attribution. |
| Person title | `personTitle` | Short text | No | Role or relationship. |
| Organization | `organization` | Short text | No | Optional. |
| Avatar | `avatar` | Media | No | Optional image asset. |
| Related work sample | `relatedWorkSample` | Reference | No | Restrict to `workSample`. |
| Featured | `featured` | Boolean | No | Used for selected display. |
| Sort order | `sortOrder` | Integer | No | Lower numbers appear first. |

Recommended validations:

- Restrict `avatar` to image file types.

### Site Settings

Purpose: A single entry for global site content and editorially configurable homepage selections.

Entry name: `Site Settings`
Content type ID: `siteSettings`
Display field: `siteTitle`
Expected entries: one

Fields:

| Field | Field ID | Type | Required | Notes |
| --- | --- | --- | --- | --- |
| Site title | `siteTitle` | Short text | Yes | Browser and metadata fallback. |
| Site description | `siteDescription` | Long text | No | Global metadata fallback. |
| Navigation | `navigation` | JSON object | No | Labels and paths for global navigation. |
| Homepage featured work | `homepageFeaturedWork` | References, many | No | Restrict to `workSample`. |
| Homepage featured posts | `homepageFeaturedPosts` | References, many | No | Restrict to `blogPost`. |
| Contact CTA | `contactCta` | Long text | No | Short call-to-action copy. |
| Default SEO image | `defaultSeoImage` | Media | No | Open Graph fallback image. |

Recommended validations:

- Restrict `defaultSeoImage` to image file types.
- Keep only one published `siteSettings` entry.

## Suggested Routes

The Next.js app can map these content types to routes as follows:

| Route | Content source |
| --- | --- |
| `/` | `profile`, `siteSettings`, featured `workSample`, featured `blogPost`, featured `expertiseTag` |
| `/about` | `profile`, selected `experience`, selected `expertiseTag`, selected `testimonial` |
| `/resume` | `profile`, `experience`, `expertiseTag` |
| `/work` | `workSample`, `expertiseTag` |
| `/work/[slug]` | Single `workSample` |
| `/blog` | `blogPost`, `expertiseTag` |
| `/blog/[slug]` | Single `blogPost` |
| `/contact` | `profile`, `siteSettings` |

## Editorial Workflow

1. Create or update reusable `Expertise Tag` entries first.
2. Create the single `Profile` entry.
3. Create `Experience` entries for resume content.
4. Create `Work Sample` entries for portfolio pieces.
5. Create `Blog Post` entries for site-authored articles.
6. Create optional `Testimonial` entries.
7. Create the single `Site Settings` entry and choose featured content.

## Implementation Notes

- Store Contentful credentials in environment variables, not in source files.
- Fetch Contentful data from server-side Next.js code.
- Generate static params for detail routes from published slugs.
- Add draft preview support after the first published-data implementation works.
- Add on-demand revalidation after deployment settings are known.
- Keep UI labels generic unless they are coming from editable Contentful fields.
