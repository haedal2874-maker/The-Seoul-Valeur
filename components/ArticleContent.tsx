import type { Article } from "@/lib/content";

export function ArticleContent({ article }: { article: Article }) {
  return (
    <div className="richArticle">
      {article.contentBlocks?.map((block, index) => {
        if (block.kind === "h2") return <h2 key={index}>{block.text}</h2>;
        if (block.kind === "table") return (
          <div className="articleTableWrap" key={index}>
            <table>
              <thead><tr>{block.rows[0].map((cell, i) => <th scope="col" key={i}>{cell}</th>)}</tr></thead>
              <tbody>{block.rows.slice(1).map((row, i) => <tr key={i}>{row.map((cell, j) => <td key={j}>{cell}</td>)}</tr>)}</tbody>
            </table>
          </div>
        );
        if (block.kind === "list") return <ol key={index}>{block.items.map((item, i) => <li key={i}>{item}</li>)}</ol>;
        return <p key={index} className={block.kind === "note" ? "articleNote" : undefined}>
          {block.text}{block.refs?.map(id => {
            const source = article.sources?.find(s => s.id === id);
            return source ? <a className="articleReference" href={source.url} key={id} aria-label={`Source: ${source.title}`}> [{id}]</a> : null;
          })}
        </p>;
      })}
      {!!article.relatedLinks?.length && <section aria-labelledby="related-heading">
        <h2 id="related-heading">Keep reading</h2>
        <ul>{article.relatedLinks.map(link => <li key={link.href}><a href={link.href}>{link.title}</a></li>)}</ul>
      </section>}
      {!!article.sources?.length && <section aria-labelledby="sources-heading">
        <h2 id="sources-heading">Sources</h2>
        <ul>{article.sources.map(source => <li key={source.id}><a href={source.url}>{source.id}: {source.title}</a></li>)}</ul>
      </section>}
    </div>
  );
}
