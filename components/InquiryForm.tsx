"use client";

import Script from "next/script";
import { useRef, useState } from "react";
import { trackEvent } from "@/lib/analytics";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          theme: "light";
          size: "flexible";
          callback: (token: string) => void;
          "expired-callback": () => void;
          "error-callback": () => void;
        }
      ) => string;
      reset: (widgetId: string) => void;
    };
  }
}

type Status = "idle" | "submitting" | "success" | "error";

export function InquiryForm() {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const widgetHost = useRef<HTMLDivElement>(null);
  const widgetId = useRef<string | null>(null);
  const started = useRef(false);
  const [turnstileToken, setTurnstileToken] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  function renderTurnstile() {
    if (!siteKey || !widgetHost.current || !window.turnstile || widgetId.current) {
      return;
    }

    widgetId.current = window.turnstile.render(widgetHost.current, {
      sitekey: siteKey,
      theme: "light",
      size: "flexible",
      callback: setTurnstileToken,
      "expired-callback": () => setTurnstileToken(""),
      "error-callback": () => setTurnstileToken("")
    });
  }

  function markStarted() {
    if (started.current) return;
    started.current = true;
    trackEvent("inquiry_start", {
      page_path: window.location.pathname,
      content_category: "consultation"
    });
  }

  async function submitInquiry(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!turnstileToken) {
      setStatus("error");
      setMessage("Please complete the security check before submitting.");
      trackEvent("inquiry_error", { error_type: "turnstile_missing", page_path: window.location.pathname });
      return;
    }

    const form = event.currentTarget;
    const data = new FormData(form);
    const query = new URLSearchParams(window.location.search);
    const payload = {
      name: String(data.get("name") ?? ""),
      contact: String(data.get("contact") ?? ""),
      travelTiming: String(data.get("travelTiming") ?? ""),
      interest: String(data.get("interest") ?? ""),
      question: String(data.get("question") ?? ""),
      consent: data.get("consent") === "on",
      turnstileToken,
      sourceUrl: window.location.href,
      utmSource: query.get("utm_source") ?? "",
      utmMedium: query.get("utm_medium") ?? "",
      utmCampaign: query.get("utm_campaign") ?? ""
    };

    setStatus("submitting");

    try {
      const response = await fetch("/api/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = (await response.json()) as { ok?: boolean; message?: string };

      if (!response.ok || !result.ok) {
        throw new Error(result.message || "Your inquiry could not be submitted.");
      }

      setStatus("success");
      setMessage("Your question has been received. We will review it before replying.");
      form.reset();
      setTurnstileToken("");
      if (widgetId.current && window.turnstile) window.turnstile.reset(widgetId.current);
      trackEvent("inquiry_submit", {
        page_path: window.location.pathname,
        content_category: "consultation",
        destination_type: "google_sheets"
      });
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Your inquiry could not be submitted.");
      trackEvent("inquiry_error", { error_type: "submission_failed", page_path: window.location.pathname });
    }
  }

  return (
    <>
      {siteKey ? (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onLoad={renderTurnstile}
        />
      ) : null}
      <form className="inquiryForm" onFocus={markStarted} onSubmit={submitInquiry}>
        <label>
          Name
          <input type="text" name="name" autoComplete="name" maxLength={80} required placeholder="Your name" />
        </label>
        <label>
          Email or Instagram
          <input type="text" name="contact" autoComplete="email" maxLength={160} required placeholder="Where should we reply?" />
        </label>
        <label>
          Travel timing <span className="optionalLabel">Optional</span>
          <input type="text" name="travelTiming" maxLength={120} placeholder="Example: March 2027, 5 days in Seoul" />
        </label>
        <label>
          Main interest
          <select name="interest" defaultValue="" required>
            <option value="" disabled>Select one</option>
            <option value="treatment-terms">K-beauty treatment terms</option>
            <option value="clinic-booking">Clinic booking questions</option>
            <option value="beauty-itinerary">Beauty shopping and itinerary</option>
            <option value="partner-collaboration">Partner or creator collaboration</option>
          </select>
        </label>
        <label>
          Question
          <textarea name="question" maxLength={2000} required placeholder="Tell us what you want to understand before booking." />
        </label>
        <label className="checkboxLabel">
          <input type="checkbox" name="consent" required />
          <span>I agree that The Seoul Valeur may use these details to review and reply to my inquiry.</span>
        </label>
        {siteKey ? <div ref={widgetHost} className="turnstileHost" /> : (
          <p className="formNotice">The secure inquiry connection is being finalized.</p>
        )}
        <div className="formActions">
          <button className="buttonPrimary" disabled={!siteKey || status === "submitting"} type="submit">
            {status === "submitting" ? "Submitting..." : "Submit inquiry"}
          </button>
        </div>
        {message ? <p className={`formMessage formMessage-${status}`} role="status">{message}</p> : null}
      </form>
    </>
  );
}
