"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
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
  const [inquiryType, setInquiryType] = useState("clinic");
  const [visitPlan, setVisitPlan] = useState("exploring");
  const successHeading = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).get("type") === "general") setInquiryType("general");
  }, []);

  useEffect(() => {
    if (status === "success") successHeading.current?.focus();
  }, [status]);

  function resetSecurity() {
    setTurnstileToken("");
    if (widgetId.current && window.turnstile) window.turnstile.reset(widgetId.current);
  }

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
    if (status === "submitting") return;
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
      formVersion: 2,
      inquiryType,
      country: String(data.get("country") ?? ""),
      language: String(data.get("language") ?? ""),
      visitPlan: inquiryType === "clinic" ? visitPlan : "",
      budget: inquiryType === "clinic" ? String(data.get("budget") ?? "") : "",
      name: String(data.get("name") ?? ""),
      contact: String(data.get("contact") ?? ""),
      travelTiming: String(data.get("travelTiming") ?? ""),
      interest: inquiryType === "clinic" ? String(data.get("interest") ?? "") : "general",
      question: String(data.get("question") ?? ""),
      consent: data.get("consent") === "on",
      turnstileToken,
      sourceUrl: window.location.origin + window.location.pathname,
      article: query.get("article") ?? "",
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
      form.reset();
      resetSecurity();
      trackEvent("inquiry_submit", {
        page_path: window.location.pathname,
        content_category: "consultation",
        destination_type: "google_sheets"
      });
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Your inquiry could not be submitted.");
      resetSecurity();
      trackEvent("inquiry_error", { error_type: "submission_failed", page_path: window.location.pathname });
    }
  }

  return (
    <>
      {siteKey ? (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onReady={renderTurnstile}
        />
      ) : null}
      {status === "success" ? (
        <section className="contactSuccess" aria-live="polite">
          <h2 ref={successHeading} tabIndex={-1}>Your inquiry has been received.</h2>
          <p>We will review your message and reply by email. Please check your spam folder as well.</p>
          {inquiryType === "clinic" && <p>This is an inquiry, not a confirmed clinic appointment. We may ask for more details before outlining possible next steps.</p>}
          <a href="/">Back to the journal</a>
        </section>
      ) : <form className="inquiryForm" onFocus={markStarted} onSubmit={submitInquiry}>
        <fieldset disabled={status === "submitting"} className="contactFields">
        <fieldset className="inquiryRoutes">
          <legend>What would you like to discuss?</legend>
          <div>
            <label><input type="radio" name="inquiryType" value="clinic" checked={inquiryType === "clinic"} onChange={() => { setInquiryType("clinic"); setMessage(""); }} />Clinic visit</label>
            <label><input type="radio" name="inquiryType" value="general" checked={inquiryType === "general"} onChange={() => { setInquiryType("general"); setMessage(""); }} />General inquiry</label>
          </div>
        </fieldset>
        {inquiryType === "general" && <p className="formNotice">Questions about an article or something else? Send us a message.</p>}
        {inquiryType === "clinic" && <>
          <label>Area of interest
            <select name="interest" defaultValue="" required>
              <option value="" disabled>Select one</option>
              <option value="dermatology">Dermatology</option>
              <option value="plastic-surgery">Plastic surgery</option>
              <option value="not-sure">Not sure yet</option>
            </select>
          </label>
          <label>Visit plans
            <select name="visitPlan" value={visitPlan} onChange={event => setVisitPlan(event.target.value)}>
              <option value="exploring">Still exploring</option>
              <option value="approximate">I have a rough timeframe</option>
              <option value="dates-set">My travel dates are set</option>
            </select>
          </label>
          {visitPlan !== "exploring" && <label>Travel timing
            <input type="text" name="travelTiming" maxLength={120} required placeholder="For example: March 2027, or March 8 to 15" />
          </label>}
          <label>Budget (optional)<input name="budget" maxLength={120} placeholder="Amount and currency, if you have a budget in mind" /></label>
        </>}
        <label>
          {inquiryType === "clinic" ? "What would you like to ask about your visit?" : "Your message"}
          <textarea name="question" maxLength={2000} required aria-describedby="sensitive-info" placeholder={inquiryType === "clinic" ? "Tell us what you are interested in and what you would like help understanding." : "Tell us your question. You can include the article title."} />
        </label>
        <p id="sensitive-info" className="formNotice">Please do not include passport details, medical records, photographs or detailed medical history.</p>
        <div className="contactPair">
        <label>
          Name
          <input type="text" name="name" autoComplete="name" maxLength={80} required placeholder="Your name" />
        </label>
        <label>
          Email
          <input type="email" name="contact" autoComplete="email" maxLength={160} required placeholder="you@example.com" />
        </label>
        <label>Country of residence<input name="country" autoComplete="country-name" maxLength={80} required /></label>
        <label>Preferred language<input name="language" maxLength={60} required placeholder="For example: English" /></label>
        </div>
        <p className="formNotice">We will confirm whether support in your preferred language is available.</p>
        <label className="checkboxLabel">
          <input type="checkbox" name="consent" required />
          <span>I agree that The Seoul Valeur may use these details to review and reply to my inquiry, as described in the <a href="/privacy">Privacy notice</a>.</span>
        </label>
        </fieldset>
        {siteKey ? <div ref={widgetHost} className="turnstileHost" /> : (
          <p className="formNotice">The secure inquiry connection is being finalized.</p>
        )}
        <div className="formActions">
          <button className="buttonPrimary" disabled={!siteKey || status === "submitting"} type="submit">
            {status === "submitting" ? "Submitting..." : "Submit inquiry"}
          </button>
        </div>
        {message ? <p className={`formMessage formMessage-${status}`} role="alert">{message}</p> : null}
      </form>}
    </>
  );
}
