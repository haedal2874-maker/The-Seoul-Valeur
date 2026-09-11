import { InquiryForm } from "@/components/InquiryForm";

export const metadata = {
  title: "Ask Korean Unnie",
  description: "Ask before booking your Seoul beauty trip."
};

export default function AskPage() {
  return (
    <section className="formPage">
      <div className="formShell">
        <div>
          <p className="eyebrow">Ask Korean Unnie</p>
          <h1>Ask before booking your Seoul beauty trip.</h1>
          <p>
            Share your travel dates, beauty concern, and what you are trying to understand.
            We will organize your question and reply through the contact you provide.
          </p>
          <InquiryForm />
        </div>
        <aside className="sideBox">
          <p className="eyebrow">Boundary</p>
          <h3>Planning help, not medical advice.</h3>
          <p>
            We help organize questions and travel context. Medical decisions should be made
            with qualified professionals.
          </p>
        </aside>
      </div>
    </section>
  );
}
