import type { Article } from "@/lib/content";

type Props = {
  article: Article;
  large?: boolean;
};

export function ArticleCard({ article, large = false }: Props) {
  return (
    <article className={large ? "articleCard articleCardLarge" : "articleCard"}>
      <a href={`/articles/${article.slug}`} className="cardImageLink" aria-label={article.title}>
        <img src={article.image} alt={article.imageAlt} />
      </a>
      <div className="cardBody">
        <p className="eyebrow">{article.category}</p>
        <h3>
          <a href={`/articles/${article.slug}`}>{article.title}</a>
        </h3>
        <p>{article.dek}</p>
        <div className="metaLine">
          <span>{article.readTime}</span>
          <span>Updated {article.updated}</span>
          {article.reviewed ? <span>Reviewed</span> : null}
        </div>
      </div>
    </article>
  );
}
