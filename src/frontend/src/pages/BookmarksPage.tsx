import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { Bookmark } from "lucide-react";
import { motion } from "motion/react";
import ArticleCard from "../components/ArticleCard";
import { formatDate } from "../data/sampleArticles";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetBookmarkedArticles } from "../hooks/useQueries";

export default function BookmarksPage() {
  const { identity } = useInternetIdentity();
  const { data: bookmarkedArticles, isLoading } = useGetBookmarkedArticles();

  if (!identity) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <Bookmark size={40} className="mx-auto text-muted-foreground mb-4" />
        <h2 className="font-display text-2xl mb-3">
          Login untuk melihat bookmark
        </h2>
        <p className="text-muted-foreground text-sm mb-6">
          Simpan artikel favorit kamu dengan login terlebih dahulu.
        </p>
        <Link to="/login">
          <Button data-ocid="bookmarks.login.primary_button">
            Masuk Sekarang
          </Button>
        </Link>
      </div>
    );
  }

  const articles = (bookmarkedArticles ?? []).map((a) => ({
    id: a.id.toString(),
    title: a.title,
    excerpt: a.excerpt,
    coverImageUrl: a.coverImageUrl,
    category: a.category,
    authorName: a.author.toString().slice(0, 12),
    authorPrincipal: a.author.toString(),
    publishedAt: formatDate(
      new Date(Number(a.publishedAt) / 1_000_000).toISOString(),
    ),
  }));

  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="flex items-center gap-3 mb-8">
          <Bookmark size={20} className="text-muted-foreground" />
          <div>
            <h1 className="font-display text-2xl font-bold">
              Artikel Tersimpan
            </h1>
            <p className="text-muted-foreground text-sm">
              {isLoading ? "Memuat..." : `${articles.length} artikel disimpan`}
            </p>
          </div>
        </div>

        {isLoading ? (
          <div
            data-ocid="bookmarks.loading_state"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-72 rounded-xl" />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div
            data-ocid="bookmarks.empty_state"
            className="text-center py-20 text-muted-foreground"
          >
            <Bookmark size={36} className="mx-auto mb-4 opacity-40" />
            <p className="text-lg font-medium mb-2">
              Belum ada artikel tersimpan
            </p>
            <p className="text-sm mb-6">
              Mulai jelajahi artikel dan simpan yang kamu suka!
            </p>
            <Link to="/">
              <Button
                data-ocid="bookmarks.explore.primary_button"
                variant="outline"
              >
                Jelajahi Artikel
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {articles.map((article, i) => (
              <ArticleCard
                key={article.id}
                id={article.id}
                title={article.title}
                excerpt={article.excerpt}
                coverImageUrl={article.coverImageUrl}
                category={article.category}
                authorName={article.authorName}
                authorPrincipal={article.authorPrincipal}
                publishedAt={article.publishedAt}
                index={i}
                ocidPrefix="bookmarks.article"
              />
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
