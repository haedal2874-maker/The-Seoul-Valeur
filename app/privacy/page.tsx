export const metadata = {
  title: "Privacy",
  description: "How The Seoul Valeur handles inquiries and optional analytics."
};

export default function PrivacyPage() {
  return (
    <section className="pageHeader privacyPage">
      <p className="eyebrow">Privacy</p>
      <h1>Your questions stay separate from our analytics.</h1>
      <p>
        The Seoul Valeur uses Cloudflare Web Analytics for privacy-first traffic measurement.
        Optional Google Analytics runs only after you allow analytics cookies.
      </p>
      <h2>Inquiry information</h2>
      <p>
        When you submit an inquiry, we store the details you provide so we can review and reply.
        These include your name, email, optional country of residence and preferred language, inquiry type,
        message and, for clinic inquiries, your area of interest, visit plans and optional budget. We also
        record the referring article when supplied by a site link, and campaign tags carried from that article to the inquiry page. These tags are not stored in an additional browser cookie. Inquiries are
        processed through Cloudflare and stored in Google Sheets for our team to review.
        Inquiry fields are not sent to Google Analytics. Please avoid sharing identification
        numbers, medical records, photographs, or other highly sensitive information.
      </p>
      <h2>Optional analytics</h2>
      <p>
        If you allow analytics, we measure page paths and actions such as starting or completing
        the inquiry form. We do not send names, email addresses, social handles, free-text
        questions, or selected concerns to analytics services.
      </p>
      <h2>Your choice</h2>
      <p>
        You can reject optional analytics and continue using the site. You can also reopen
        Privacy settings from the footer and change your choice at any time.
      </p>
      <h2>Contact</h2>
      <p>
        For access, correction, or deletion questions about an inquiry, use the <a href="/contact?type=general">Contact page</a> and
        write “Privacy request” at the beginning of your message.
      </p>
    </section>
  );
}
