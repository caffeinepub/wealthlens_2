import { Skeleton } from "@/components/ui/skeleton";
import { useParams } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Category } from "../backend";
import ArticleCard from "../components/ArticleCard";
import { CATEGORY_LABELS, formatDate } from "../data/sampleArticles";
import { useGetArticlesByCategory } from "../hooks/useQueries";

const CATEGORY_MAP: Record<string, Category> = {
  stock: Category.stock,
  crypto: Category.crypto,
  property: Category.property,
  finance: Category.finance,
  economicHistory: Category.economicHistory,
};

export default function CategoryPage() {
  const { name } = useParams({ from: "/layout/category/$name" });
  const category = CATEGORY_MAP[name];
  const { data: articles = [], isLoading } = useGetArticlesByCategory(
    category ?? Category.finance,
  );

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="mb-8">
          <p className="text-sm text-muted-foreground uppercase tracking-widest mb-1">
            Kategori
          </p>
          <h1 className="font-display text-3xl font-bold">
            {category ? CATEGORY_LABELS[category] : "Tidak Ditemukan"}
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            {isLoading ? "Memuat..." : `${articles.length} artikel tersedia`}
          </p>
        </div>

        {isLoading ? (
          <div
            data-ocid="category.loading_state"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-72 rounded-xl" />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div
            data-ocid="category.empty_state"
            className="text-center py-20 text-muted-foreground"
          >
            <p>Belum ada artikel di kategori ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.map((article, i) => (
              <ArticleCard
                key={article.id.toString()}
                id={article.id.toString()}
                title={article.title}
                excerpt={article.excerpt}
                coverImageUrl={article.coverImageUrl}
                category={article.category}
                authorName={article.author.toString().slice(0, 12)}
                publishedAt={formatDate(
                  new Date(
                    Number(article.publishedAt) / 1_000_000,
                  ).toISOString(),
                )}
                index={i}
                ocidPrefix="category.article"
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
