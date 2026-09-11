"use client";

import type { ReactNode } from "react";
import { trackEvent, type AnalyticsEventName, type AnalyticsEventParams } from "@/lib/analytics";

type Props = {
  href: string;
  className?: string;
  eventName: AnalyticsEventName;
  eventParams: AnalyticsEventParams;
  children: ReactNode;
};

export function TrackedLink({ href, className, eventName, eventParams, children }: Props) {
  return (
    <a
      href={href}
      className={className}
      onClick={() => trackEvent(eventName, { ...eventParams, page_path: window.location.pathname })}
    >
      {children}
    </a>
  );
}
