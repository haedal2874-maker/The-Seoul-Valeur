import type { MetadataRoute } from "next";
import { indexingEnabled, siteUrl } from "@/lib/site";

export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      ...(indexingEnabled ? { allow: "/" } : { disallow: "/" })
    },
    ...(indexingEnabled ? { sitemap: `${siteUrl}/sitemap.xml` } : {})
  };
}
