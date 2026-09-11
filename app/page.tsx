import { ArticleCard } from "@/components/ArticleCard";
import { articles, categories } from "@/lib/content";
import { TrackedLink } from "@/components/TrackedLink";

export default function Home() {
  const featured = articles[0];
  const secondary = articles.slice(1);

  return (
    <>
      <section className="hero">
        <div className="heroImage">
          <img
            src="https://images.unsplash.com/photo-1538485399081-7c8ed389784c?auto=format&fit=crop&w=1800&q=80"
            alt="A refined Seoul street scene for beauty travelers"
          />
        </div>
        <div className="heroCopy">
          <p className="eyebrow">Seoul Beauty & Travel Journal</p>
          <h1>The Seoul Valeur</h1>
          <p>
            A polished guide to K-beauty treatments, Seoul clinic questions, Korean beauty
            products, and beauty-aware travel routes.
          </p>
          <div className="heroActions">
            <a className="buttonPrimary" href="/start-here">Start Here</a>
            <TrackedLink
              className="buttonSecondary"
              href="/ask-korean-unnie"
              eventName="cta_click"
              eventParams={{ cta_name: "ask_before_booking", cta_location: "home_hero", destination_type: "inquiry" }}
            >
              Ask before booking
            </TrackedLink>
          </div>
        </div>
      </section>

      <section className="sectionIntro">
        <p className="eyebrow">Popular searches</p>
        <div className="topicChips">
          {["Rejuran", "Skin Booster", "Seoul Skin Clinic", "Olive Young", "Gangnam", "Glowcation"].map((topic) => (
            <a href="/start-here" key={topic}>{topic}</a>
          ))}
        </div>
      </section>

      <section className="contentGrid featuredGrid">
        <div>
          <p className="eyebrow">Featured guide</p>
          <ArticleCard article={featured} large />
        </div>
        <aside className="editorNote">
          <p className="eyebrow">Editorial guide</p>
          <h2>Beauty travel should feel informed, not rushed.</h2>
          <p>
            We translate the search terms, clinic questions, product trends, and Seoul routes
            global readers want to understand before making a private decision.
          </p>
          <a href="/category/seoul-clinic-guide">Read clinic guides</a>
        </aside>
      </section>

      <section className="sectionBlock">
        <div className="sectionHeading">
          <p className="eyebrow">Latest journal</p>
          <h2>Before your Seoul beauty trip</h2>
        </div>
        <div className="articleGrid">
          {secondary.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </section>

      <section className="categoryBand">
        {categories.map((category) => (
          <a href={`/category/${category.slug}`} className="categoryTile" key={category.slug}>
            <span>{category.kicker}</span>
            <strong>{category.name}</strong>
            <small>{category.description}</small>
          </a>
        ))}
      </section>

      <section className="ctaBand">
        <p className="eyebrow">Ask Korean Unnie</p>
        <h2>Need help understanding Korean clinic terms before booking?</h2>
        <p>
          Share your travel dates, beauty concern, and questions. We will help you prepare
          the right questions before you make a decision.
        </p>
        <TrackedLink
          className="buttonPrimary"
          href="/ask-korean-unnie"
          eventName="cta_click"
          eventParams={{ cta_name: "plan_beauty_trip", cta_location: "home_bottom", destination_type: "inquiry" }}
        >
          Plan your Seoul beauty trip
        </TrackedLink>
      </section>
    </>
  );
}
