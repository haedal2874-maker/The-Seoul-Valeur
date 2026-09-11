import { TrackedLink } from "@/components/TrackedLink";

export const metadata = {
  title: "Partner With The Seoul Valeur",
  description: "Collaboration page for brands, clinics, hotels, restaurants, and travel partners."
};

export default function PartnerPage() {
  return (
    <section className="formPage">
      <div className="formShell">
        <div>
          <p className="eyebrow">Partner With The Seoul Valeur</p>
          <h1>Collaborate with a Seoul K-beauty travel magazine.</h1>
          <p>
            The Seoul Valeur is designed for global readers researching Korean beauty,
            clinic questions, beauty products, hotels, cafes, shopping, and calm Seoul routes.
          </p>
          <section className="takeaways">
            <p className="eyebrow">Possible collaborations</p>
            <ul>
              <li>Korean beauty brand stories and product education.</li>
              <li>Clinic guide content with clear editorial boundaries.</li>
              <li>Hotel, cafe, restaurant, and travel routes for beauty visitors.</li>
              <li>Creator visit concepts for future influencer recruitment campaigns.</li>
            </ul>
          </section>
          <TrackedLink
            className="buttonPrimary"
            href="/ask-korean-unnie"
            eventName="partner_interest"
            eventParams={{ cta_name: "partner_inquiry", cta_location: "partner_page", destination_type: "inquiry" }}
          >
            Start a partnership conversation
          </TrackedLink>
        </div>
        <aside className="sideBox">
          <p className="eyebrow">Trust first</p>
          <h3>Partner content must stay transparent.</h3>
          <p>
            Sponsored or partner-supported material should be clearly marked and should not
            promise medical outcomes, invented experiences, or guaranteed benefits.
          </p>
        </aside>
      </div>
    </section>
  );
}
