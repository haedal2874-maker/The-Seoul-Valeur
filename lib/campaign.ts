// Carry only campaign labels to the inquiry page. Never copy arbitrary query data.
export function inquiryCampaignHref(href: string, currentUrl: string) {
  const current = new URL(currentUrl);
  const target = new URL(href, current);
  if (target.origin !== current.origin || !/^\/contact\/?$/.test(target.pathname)) return href;
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_content"]) {
    const value = current.searchParams.get(key);
    if (!target.searchParams.has(key) && value && /^[a-zA-Z0-9_.-]{1,120}$/.test(value)) {
      target.searchParams.set(key, value);
    }
  }
  return target.pathname + target.search + target.hash;
}
