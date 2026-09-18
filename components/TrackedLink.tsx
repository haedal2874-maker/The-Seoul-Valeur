"use client";

import { useEffect, useState, type ReactNode } from "react";
import { inquiryCampaignHref } from "@/lib/campaign";
import { trackEvent, type AnalyticsEventName, type AnalyticsEventParams } from "@/lib/analytics";

type Props = {
  href: string;
  className?: string;
  eventName: AnalyticsEventName;
  eventParams: AnalyticsEventParams;
  children: ReactNode;
};

export function TrackedLink({ href, className, eventName, eventParams, children }: Props) {
  const [destination, setDestination] = useState(href);
  useEffect(() => {
    setDestination(inquiryCampaignHref(href, window.location.href));
  }, [href]);
  return (
    <a
      href={destination}
      className={className}
      onClick={() => trackEvent(eventName, { ...eventParams, page_path: window.location.pathname })}
    >
      {children}
    </a>
  );
}
