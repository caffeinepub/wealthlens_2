import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { ArrowRight, PenLine } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Category } from "../backend";
import AuthorArticleCard from "../components/AuthorArticleCard";
import { CATEGORY_LABELS, formatDate } from "../data/sampleArticles";
import { useGetAllArticles } from "../hooks/useQueries";

const FILTERS = [
  { key: "all", label: "Semua" },
  { key: Category.stock, label: CATEGORY_LABELS[Category.stock] },
  { key: Category.crypto, label: CATEGORY_LABELS[Category.crypto] },
  { key: Category.property, label: CATEGORY_LABELS[Category.property] },
  { key: Category.finance, label: CATEGORY_LABELS[Category.finance] },
  {
    key: Category.economicHistory,
    label: CATEGORY_LABELS[Category.economicHistory],
  },
];

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const { data: allArticles, isLoading } = useGetAllArticles();

  const articles = allArticles ?? [];
  const filteredArticles =
    activeFilter === "all"
      ? articles
      : articles.filter((a) => a.category === activeFilter);

  return (
    <div className="max-w-6xl mx-auto px-6 py-6">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-2xl overflow-hidden mb-10 min-h-[380px] flex items-end"
        data-ocid="hero.section"
      >
        <img
          src="/assets/generated/hero-wealthlens.dim_1200x500.jpg"
          alt="WealthLens Hero"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
        <div className="relative z-10 p-8 md:p-12 max-w-2xl">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-white/70 mb-3">
            Komunitas Investasi
          </span>
          <h1 className="font-display text-2xl md:text-4xl text-white font-bold leading-tight mb-4">
            Investasi Cerdas Dimulai dari Sini
          </h1>
          <p className="text-sm md:text-base text-white/75 leading-relaxed mb-6 line-clamp-2">
            Temukan wawasan terdalam tentang saham, crypto, properti, dan
            ekonomi dari komunitas penulis WealthLens.
          </p>
          <div className="flex items-center gap-4">
            <a href="#articles">
              <Button
                data-ocid="hero.read.primary_button"
                className="bg-white text-foreground hover:bg-white/90 font-semibold text-sm"
              >
                Mulai Membaca <ArrowRight size={14} className="ml-1" />
              </Button>
            </a>
          </div>
        </div>
      </motion.section>

      <section id="articles">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h2 className="font-display text-2xl font-bold">Artikel Utama</h2>
          <div className="flex flex-wrap gap-2" data-ocid="home.filter.tab">
            {FILTERS.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                data-ocid={`home.filter_${key}.tab`}
                onClick={() => setActiveFilter(key)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  activeFilter === key
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-accent"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div
            data-ocid="home.loading_state"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-72 rounded-xl" />
            ))}
          </div>
        ) : filteredArticles.length === 0 ? (
          <div
            data-ocid="home.empty_state"
            className="text-center py-24 text-muted-foreground"
          >
            <PenLine size={40} className="mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium mb-2">
              Belum ada artikel, jadilah yang pertama menulis!
            </p>
            <p className="text-sm mb-6">
              Login sebagai penulis dan bagikan wawasan investasimu.
            </p>
            <Link to="/login">
              <Button data-ocid="home.login.primary_button" variant="outline">
                Masuk sebagai Penulis
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredArticles.map((article, i) => (
              <AuthorArticleCard
                key={article.id.toString()}
                id={article.id.toString()}
                title={article.title}
                excerpt={article.excerpt}
                coverImageUrl={article.coverImageUrl}
                category={article.category}
                authorPrincipal={article.author.toString()}
                publishedAt={formatDate(
                  new Date(
                    Number(article.publishedAt) / 1_000_000,
                  ).toISOString(),
                )}
                index={i}
                ocidPrefix="home.article"
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
