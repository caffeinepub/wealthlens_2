import type { Category } from "../backend";
import { useAuthorName } from "../hooks/useAuthorName";
import ArticleCard from "./ArticleCard";

interface AuthorArticleCardProps {
  id: string;
  title: string;
  excerpt: string;
  coverImageUrl: string;
  category: Category;
  authorPrincipal: string;
  publishedAt: string;
  index?: number;
  ocidPrefix?: string;
}

export default function AuthorArticleCard({
  authorPrincipal,
  ...rest
}: AuthorArticleCardProps) {
  const authorName = useAuthorName(authorPrincipal);

  return (
    <ArticleCard
      authorName={authorName}
      authorPrincipal={authorPrincipal}
      {...rest}
    />
  );
}
