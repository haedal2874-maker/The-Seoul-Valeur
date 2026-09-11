import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/ArticleCard";
import { categories, getArticlesByCategory, getCategory } from "@/lib/content";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const category = getCategory(slug);

  if (!category) {
    return {};
  }

  return {
    title: category.name,
    description: category.description
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = getCategory(slug);

  if (!category) {
    notFound();
  }

  const categoryArticles = getArticlesByCategory(slug);

  return (
    <>
      <section className="pageHeader">
        <p className="eyebrow">{category.kicker}</p>
        <h1>{category.name}</h1>
        <p>{category.description}</p>
      </section>
      <section className="sectionBlock">
        <div className="articleGrid">
          {categoryArticles.length > 0 ? (
            categoryArticles.map((article) => <ArticleCard key={article.slug} article={article} />)
          ) : (
            <div className="editorNote">
              <p className="eyebrow">Coming next</p>
              <h2>This shelf is being curated.</h2>
              <p>
                Approved guides will appear here after editorial review and final approval.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
