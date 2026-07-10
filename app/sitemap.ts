import type { MetadataRoute } from "next";
import { getBlogPosts, getWorkSamples } from "@/lib/contentful";
import { absoluteUrl } from "@/lib/site";

const staticRoutes: MetadataRoute.Sitemap = [
  {
    url: absoluteUrl("/"),
    changeFrequency: "weekly",
    priority: 1,
  },
  {
    url: absoluteUrl("/about"),
    changeFrequency: "monthly",
    priority: 0.8,
  },
  {
    url: absoluteUrl("/work"),
    changeFrequency: "weekly",
    priority: 0.9,
  },
  {
    url: absoluteUrl("/blog"),
    changeFrequency: "weekly",
    priority: 0.8,
  },
  {
    url: absoluteUrl("/writing"),
    changeFrequency: "monthly",
    priority: 0.6,
  },
  {
    url: absoluteUrl("/resume"),
    changeFrequency: "monthly",
    priority: 0.7,
  },
  {
    url: absoluteUrl("/contact"),
    changeFrequency: "monthly",
    priority: 0.7,
  },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [workSamples, blogPosts] = await Promise.all([
    getWorkSamples(),
    getBlogPosts(),
  ]);

  return [
    ...staticRoutes,
    ...workSamples.map((sample) => ({
      url: absoluteUrl(`/work/${sample.slug}`),
      lastModified: sample.publishDate ?? undefined,
      changeFrequency: "monthly" as const,
      priority: sample.featured ? 0.8 : 0.7,
    })),
    ...blogPosts.map((post) => ({
      url: absoluteUrl(`/blog/${post.slug}`),
      lastModified: post.publishDate,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
