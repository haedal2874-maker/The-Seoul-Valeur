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
        <p>Considering a dermatology or plastic surgery visit in Korea? Tell us what you have in mind. You do not need to know a treatment name to start.</p>
      </header>
      <div className="formShell">
        <InquiryForm />
        <aside className="contactAside">
          <h2>What happens next</h2>
          <ol>
            <li><strong>We read your inquiry.</strong><p>We review your questions and any travel plans you share.</p></li>
            <li><strong>We clarify the details.</strong><p>We may email you for more information before discussing possible support.</p></li>
            <li><strong>We explain the next steps.</strong><p>We outline available consultation or visit support. Sending this form does not confirm an appointment.</p></li>
          </ol>
          <div className="contactBoundary">
            <h2>A place to start, not a diagnosis</h2>
            <p>Treatment suitability and medical decisions belong with a qualified clinician. This form is not for urgent medical concerns.</p>
          </div>
          <p>For brands, clinics and collaborators: <a href="/partner-with-us">Partner with us</a>.</p>
        </aside>
      </div>
    </section>
  );
}
