import { categories } from "@/lib/content";
import { Logo } from "./Logo";

export function Header() {
  return (
    <header className="siteHeader">
      <div className="headerInner">
        <Logo />
        <nav className="mainNav" aria-label="Main navigation">
          {categories.slice(0, 4).map((category) => (
            <a key={category.slug} href={`/category/${category.slug}`}>
              {category.name}
            </a>
          ))}
          <a href="/ask-korean-unnie">Ask</a>
          <a href="/partner-with-us">Partner</a>
        </nav>
      </div>
    </header>
  );
}
