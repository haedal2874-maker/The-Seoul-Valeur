import { notFound } from "next/navigation";
import { articles, getArticle } from "@/lib/content";
import { TrackedLink } from "@/components/TrackedLink";
import { ArticleContent } from "@/components/ArticleContent";

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

  const isGeneralGuide = ["k-beauty-products", "beauty-trip-seoul"].includes(article.categorySlug);

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
          {article.reviewNote && <span>{article.reviewNote}</span>}
        </div>
        <div className="articleHeroImage">
          <img src={article.image} alt={article.imageAlt} />
        </div>
        {article.imageCredit && <p className="articleImageCredit">{article.imageCredit}</p>}
        <section className="takeaways">
          <p className="eyebrow">Key takeaways</p>
          <ul>
            {article.takeaways.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
        {article.contentBlocks ? <ArticleContent article={article} /> : <>
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
        </>}
      </div>
      <aside className="articleAside">
        <div className="sideBox">
          <p className="eyebrow">Editorial note</p>
          <h3>{isGeneralGuide ? "A guide, not a guarantee." : "No before-and-after promises."}</h3>
          <p>
            {isGeneralGuide
              ? "This magazine helps you compare options and plan your trip. Details can change, so check current information before acting."
              : "This magazine explains terms and planning questions. Treatment decisions should be made with qualified professionals."}
          </p>
        </div>
        <div className="sideBox">
          <p className="eyebrow">{isGeneralGuide ? "Keep exploring" : "Clinic visit support"}</p>
          <h3>{isGeneralGuide ? "More for your Seoul trip" : "Need help arranging your visit?"}</h3>
          <p>{isGeneralGuide
            ? "Explore our product guides and beauty stops to plan what you want to try in Seoul."
            : "We help with clinic connections, appointments, language support and follow-up contact. Tell us what you need and roughly when you plan to visit."}</p>
          <TrackedLink
            className="buttonPrimary"
            href={isGeneralGuide ? "/category/beauty-trip-seoul/" : `/contact?type=clinic&article=${encodeURIComponent(article.slug)}`}
            eventName="cta_click"
            eventParams={{
              cta_name: isGeneralGuide ? "explore_beauty_trip" : "clinic_visit_support",
              cta_location: "article_sidebar",
              destination_type: isGeneralGuide ? "category" : "inquiry",
              content_category: article.categorySlug
            }}
          >
            {isGeneralGuide ? "Explore Seoul beauty guides" : "Ask about visit support"}
          </TrackedLink>
        </div>
      </aside>
    </article>
  );
}
