type Env = {
  TURNSTILE_SECRET_KEY: string;
  GOOGLE_APPS_SCRIPT_WEBHOOK_URL: string;
  FORM_SHARED_SECRET: string;
};

type Context = {
  request: Request;
  env: Env;
};

type InquiryPayload = {
  formVersion?: unknown;
  inquiryType?: unknown;
  country?: unknown;
  language?: unknown;
  visitPlan?: unknown;
  article?: unknown;
  budget?: unknown;
  name?: unknown;
  contact?: unknown;
  travelTiming?: unknown;
  interest?: unknown;
  question?: unknown;
  consent?: unknown;
  turnstileToken?: unknown;
  sourceUrl?: unknown;
  utmSource?: unknown;
  utmMedium?: unknown;
  utmCampaign?: unknown;
};

const limits = {
  name: 80,
  contact: 160,
  travelTiming: 120,
  interest: 60,
  question: 2000,
  sourceUrl: 500,
  utm: 120
};

function json(body: Record<string, unknown>, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8" }
  });
}

function textValue(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function onRequestPost({ request, env }: Context) {
  if (!env.TURNSTILE_SECRET_KEY || !env.GOOGLE_APPS_SCRIPT_WEBHOOK_URL || !env.FORM_SHARED_SECRET) {
    return json({ ok: false, message: "The inquiry service is not configured yet." }, 503);
  }

  let raw: InquiryPayload;
  try {
    raw = await request.json() as InquiryPayload;
  } catch {
    return json({ ok: false, message: "Invalid request." }, 400);
  }
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return json({ ok: false, message: "Invalid request." }, 400);
  }
  if (raw.formVersion !== undefined && raw.formVersion !== 2) {
    return json({ ok: false, message: "Please refresh the contact page and try again." }, 400);
  }

  const payload = {
    name: textValue(raw.name, limits.name),
    contact: textValue(raw.contact, limits.contact),
    travelTiming: textValue(raw.travelTiming, limits.travelTiming),
    interest: textValue(raw.interest, limits.interest),
    question: textValue(raw.question, limits.question),
    sourceUrl: textValue(raw.sourceUrl, limits.sourceUrl),
    utmSource: textValue(raw.utmSource, limits.utm),
    utmMedium: textValue(raw.utmMedium, limits.utm),
    utmCampaign: textValue(raw.utmCampaign, limits.utm)
  };
  const turnstileToken = textValue(raw.turnstileToken, 2048);

  if (!payload.name || !payload.contact || !payload.interest || !payload.question || raw.consent !== true) {
    return json({ ok: false, message: "Please complete all required fields and consent." }, 400);
  }

  if (raw.formVersion === 2) {
    const country = textValue(raw.country, 80).replace(/[\r\n]/g, " ");
    const language = textValue(raw.language, 60).replace(/[\r\n]/g, " ");
    const clinic = raw.inquiryType === "clinic";
    if (!["clinic", "general"].includes(String(raw.inquiryType)) || !country || !language ||
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.contact) ||
        (clinic && (!["dermatology", "plastic-surgery", "not-sure"].includes(payload.interest) ||
          !["exploring", "approximate", "dates-set"].includes(String(raw.visitPlan)) ||
          (raw.visitPlan !== "exploring" && !payload.travelTiming)))) {
      return json({ ok: false, message: "Please check your email, contact details and visit plans." }, 400);
    }
    // Keep the deployed Sheets contract: new context lives in the existing question cell.
    const article = textValue(raw.article, 160);
    const budget = textValue(raw.budget, 120).replace(/[\r\n]/g, " ");
    const context = [
      `Inquiry type: ${clinic ? "Clinic visit" : "General inquiry"}`,
      `Country of residence: ${country}`,
      `Preferred language: ${language}`,
      "Consent: inquiry response (contact v2)",
      ...(clinic && budget ? [`Budget (optional): ${budget}`] : []),
      ...(/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article) ? [`Article: /articles/${article}`] : [])
    ];
    payload.question = context.join("\n") + "\n\nMessage:\n" + payload.question;
    payload.interest = clinic ? payload.interest : "general";
    payload.travelTiming = clinic
      ? `${raw.visitPlan}${raw.visitPlan === "exploring" ? "" : `: ${payload.travelTiming}`}`
      : "";
  }
  if (!turnstileToken) {
    return json({ ok: false, message: "Please complete the security check." }, 403);
  }

  try {
  const verification = new FormData();
  verification.set("secret", env.TURNSTILE_SECRET_KEY);
  verification.set("response", turnstileToken);
  const remoteIp = request.headers.get("CF-Connecting-IP");
  if (remoteIp) verification.set("remoteip", remoteIp);
  verification.set("idempotency_key", crypto.randomUUID());

  const turnstileResponse = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    body: verification
  });
  const turnstileResult = await turnstileResponse.json() as { success?: boolean };

  if (!turnstileResult.success) {
    return json({ ok: false, message: "The security check expired or failed. Please try again." }, 403);
  }

  const submissionId = crypto.randomUUID();
  const sheetResponse = await fetch(env.GOOGLE_APPS_SCRIPT_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({
      secret: env.FORM_SHARED_SECRET,
      submissionId,
      receivedAt: new Date().toISOString(),
      ...payload
    })
  });
  const sheetResult = await sheetResponse.json().catch(() => ({ ok: false }));

  if (!sheetResponse.ok || !sheetResult.ok) {
    return json({ ok: false, message: "We could not save your inquiry. Please try again shortly." }, 502);
  }

  return json({ ok: true, submissionId });
  } catch {
    return json({ ok: false, message: "We could not confirm receipt. Please try again shortly." }, 502);
  }
}
