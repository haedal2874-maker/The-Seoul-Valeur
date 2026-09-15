import ContactPage from "../contact/page";

export const metadata = {
  title: "Contact",
  alternates: { canonical: "/contact" },
  robots: { index: false, follow: true }
};

export default function AskPage() {
  return <ContactPage />;
}
