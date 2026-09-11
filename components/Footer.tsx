import { PrivacySettingsButton } from "./AnalyticsConsent";

export function Footer() {
  return (
    <footer className="siteFooter">
      <div>
        <p className="footerBrand">The Seoul Valeur</p>
        <p>A Seoul K-beauty and travel magazine for global beauty seekers.</p>
      </div>
      <div className="footerLinks">
        <a href="/ask-korean-unnie">Ask before booking</a>
        <a href="/partner-with-us">Partner With The Seoul Valeur</a>
        <a href="/privacy">Privacy</a>
        <PrivacySettingsButton />
      </div>
    </footer>
  );
}
