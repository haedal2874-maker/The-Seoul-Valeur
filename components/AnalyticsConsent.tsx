"use client";

import Script from "next/script";
import { useEffect, useState } from "react";

const STORAGE_KEY = "tsv-analytics-consent";
const OPEN_EVENT = "tsv:open-privacy-settings";
type Consent = "granted" | "denied" | null;

export function AnalyticsConsent() {
  const [consent, setConsent] = useState<Consent>(null);
  const [isOpen, setIsOpen] = useState(false);
  const measurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved === "granted" || saved === "denied") {
      setConsent(saved);
    } else {
      setIsOpen(true);
    }

    const openSettings = () => setIsOpen(true);
    window.addEventListener(OPEN_EVENT, openSettings);
    return () => window.removeEventListener(OPEN_EVENT, openSettings);
  }, []);

  function choose(nextConsent: Exclude<Consent, null>) {
    window.localStorage.setItem(STORAGE_KEY, nextConsent);
    setConsent(nextConsent);
    setIsOpen(false);
  }

  return (
    <>
      {measurementId && consent === "granted" ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              window.gtag = gtag;
              gtag('js', new Date());
              gtag('consent', 'default', {
                analytics_storage: 'granted',
                ad_storage: 'denied',
                ad_user_data: 'denied',
                ad_personalization: 'denied'
              });
              gtag('config', '${measurementId}', {
                allow_google_signals: false,
                allow_ad_personalization_signals: false
              });
            `}
          </Script>
        </>
      ) : null}

      {isOpen ? (
        <section className="consentBanner" aria-label="Analytics privacy settings">
          <div>
            <p className="consentTitle">Optional analytics</p>
            <p>
              We use optional analytics cookies to understand which guides are useful.
              Cloudflare's privacy-first traffic measurement remains active either way.
            </p>
          </div>
          <div className="consentActions">
            <button type="button" onClick={() => choose("denied")}>Reject analytics</button>
            <button type="button" onClick={() => choose("granted")}>Allow analytics</button>
          </div>
        </section>
      ) : null}
    </>
  );
}

export function PrivacySettingsButton() {
  return (
    <button
      className="footerButton"
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}
    >
      Privacy settings
    </button>
  );
}
