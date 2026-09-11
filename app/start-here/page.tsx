export const metadata = {
  title: "Start Here",
  description: "First-time Seoul K-beauty trip guide from The Seoul Valeur."
};

export default function StartHerePage() {
  return (
    <section className="pageHeader">
      <p className="eyebrow">First-time guide</p>
      <h1>Start your Seoul beauty trip with better questions.</h1>
      <p>
        The Seoul Valeur begins with practical context: what you want to understand,
        what needs professional evaluation, and how to plan travel around comfort.
      </p>
      <div className="topicChips">
        <a href="/articles/how-to-book-a-skin-clinic-in-seoul-as-a-foreigner">Booking guide</a>
        <a href="/articles/korea-beauty-trip-checklist-before-visiting-a-clinic">Beauty trip checklist</a>
        <a href="/articles/what-is-rejuran-in-korea">Treatment dictionary</a>
      </div>
    </section>
  );
}
