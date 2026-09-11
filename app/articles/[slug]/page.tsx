import { notFound } from "next/navigation";
import { articles, getArticle } from "@/lib/content";
import { TrackedLink } from "@/components/TrackedLink";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) {
    return {};
  }

  return {
    title: article.title,
    description: article.dek,
    keywords: article.seoKeywords
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="articlePage">
      <div className="articleBody">
        <p className="eyebrow">{article.category}</p>
        <h1>{article.title}</h1>
        <p>{article.dek}</p>
        <div className="metaLine">
          <span>{article.readTime}</span>
          <span>Updated {article.updated}</span>
          {article.reviewed ? <span>Reviewed editorial guide</span> : <span>Editorial guide</span>}
        </div>
        <div className="articleHeroImage">
          <img src={article.image} alt={article.imageAlt} />
        </div>
        <section className="takeaways">
          <p className="eyebrow">Key takeaways</p>
          <ul>
            {article.takeaways.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        <h2>Guide</h2>
        {article.body.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
        <h2>Before you book</h2>
        <section className="checklist">
          <ul>
            {article.checklist.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </div>
      <aside className="articleAside">
        <div className="sideBox">
          <p className="eyebrow">Editorial note</p>
          <h3>No before-and-after promises.</h3>
          <p>
            This magazine explains terms and planning questions. Treatment decisions should be
            made with qualified professionals.
          </p>
        </div>
        <div className="sideBox">
          <p className="eyebrow">Soft CTA</p>
          <h3>Ask before booking</h3>
          <p>Tell us your travel dates, skin concern, and what you are trying to understand.</p>
          <TrackedLink
            className="buttonPrimary"
            href="/ask-korean-unnie"
            eventName="cta_click"
            eventParams={{
              cta_name: "plan_beauty_trip",
              cta_location: "article_sidebar",
              destination_type: "inquiry",
              content_category: article.categorySlug
            }}
          >
            Plan your Seoul beauty trip
          </TrackedLink>
        </div>
      </aside>
    </article>
  );
}
