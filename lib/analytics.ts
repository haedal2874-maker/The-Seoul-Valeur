"use client";

export type AnalyticsEventName =
  | "cta_click"
  | "inquiry_start"
  | "inquiry_submit"
  | "inquiry_error"
  | "outbound_social_click"
  | "partner_interest";

export type AnalyticsEventParams = {
  page_path?: string;
  content_category?: string;
  cta_name?: string;
  cta_location?: string;
  destination_type?: string;
  error_type?: string;
};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackEvent(name: AnalyticsEventName, params: AnalyticsEventParams = {}) {
  if (typeof window === "undefined" || !window.gtag) {
    return;
  }

  window.gtag("event", name, params);
}
