import { InquiryForm } from "@/components/InquiryForm";

export const metadata = {
  title: "Contact | Plan Your Korea Clinic Visit",
  description: "Ask about a dermatology or plastic surgery visit in Korea, or send a question to The Seoul Valeur.",
  alternates: { canonical: "/contact" }
};

export default function ContactPage() {
  return (
    <section className="formPage contactPage">
      <header className="contactHeader">
        <p className="eyebrow">Contact The Seoul Valeur</p>
        <h1>Plan Your Korea Clinic Visit</h1>
        <p>Still deciding where to book? The Seoul Valeur team helps you prepare for a clinic visit in Korea, arrange appointments and language support, and stay in touch with the clinic after you return home.</p>
        <p>Start with your question and a rough idea of when you might visit. You do not need to choose a treatment first.</p>
        <p>We confirm the support available for your visit, any fees, and our role with the clinic before you decide to proceed.</p>
      </header>
      <div className="formShell">
        <InquiryForm />
        <aside className="contactAside">
          <h2>What happens next</h2>
          <ol>
            <li><strong>Tell us where you are stuck.</strong><p>Choosing a clinic, understanding a quote, arranging language support or fitting a visit into your trip—we start with your question.</p></li>
            <li><strong>Get a clear next step by email.</strong><p>We clarify your plans and explain the clinic connection, booking and interpretation support available, including any service fees.</p></li>
            <li><strong>Decide what support you want.</strong><p>If you proceed, we help coordinate the agreed arrangements and confirm how to contact the clinic after your visit. Sending this form does not confirm an appointment.</p></li>
          </ol>
          <div className="contactBoundary">
            <h2>Who you are contacting</h2>
            <p>Your inquiry goes to The Seoul Valeur team. We provide visit coordination; the clinic provides medical consultation and care. Before a referral or booking, we explain our relationship with the proposed clinic and any fees that apply.</p>
            <h2>A place to start, not a diagnosis</h2>
            <p>Treatment suitability and medical decisions belong with a qualified clinician. This form is not for urgent medical concerns.</p>
          </div>
          <p>For brands, clinics and collaborators: <a href="/partner-with-us">Partner with us</a>.</p>
        </aside>
      </div>
    </section>
  );
}
