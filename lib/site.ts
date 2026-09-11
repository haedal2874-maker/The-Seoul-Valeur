const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export const siteUrl = configuredUrl
  ? configuredUrl.replace(/\/$/, "")
  : "http://localhost:3000";

export const indexingEnabled = process.env.NEXT_PUBLIC_ENABLE_INDEXING === "true";
