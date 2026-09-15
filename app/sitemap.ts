import type { MetadataRoute } from "next";
import { articles, categories } from "@/lib/content";
import { siteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/start-here",
    "/contact",
    "/partner-with-us",
    "/privacy"
  ].map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date()
  }));

  const articleRoutes = articles.map((article) => ({
    url: `${siteUrl}/articles/${article.slug}`,
    lastModified: new Date(article.updated)
  }));

  const categoryRoutes = categories.map((category) => ({
    url: `${siteUrl}/category/${category.slug}`,
    lastModified: new Date()
  }));

  return [...staticRoutes, ...articleRoutes, ...categoryRoutes];
}
