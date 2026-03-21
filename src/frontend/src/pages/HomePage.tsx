import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Category } from "../backend";
import ArticleCard from "../components/ArticleCard";
import {
  CATEGORY_LABELS,
  SAMPLE_ARTICLES,
  formatDate,
} from "../data/sampleArticles";

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

const featuredArticle = SAMPLE_ARTICLES[4];

export default function HomePage() {
  const [activeFilter, setActiveFilter] = useState<string>("all");

  const filteredArticles =
    activeFilter === "all"
      ? SAMPLE_ARTICLES
      : SAMPLE_ARTICLES.filter((a) => a.category === activeFilter);

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
            {CATEGORY_LABELS[featuredArticle.category]} · Artikel Pilihan
          </span>
          <h1 className="font-display text-2xl md:text-4xl text-white font-bold leading-tight mb-4">
            {featuredArticle.title}
          </h1>
          <p className="text-sm md:text-base text-white/75 leading-relaxed mb-6 line-clamp-2">
            {featuredArticle.excerpt}
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="/article/$id"
              params={{ id: featuredArticle.id.toString() }}
            >
              <Button
                data-ocid="hero.read.primary_button"
                className="bg-white text-foreground hover:bg-white/90 font-semibold text-sm"
              >
                Baca Artikel Terbaru <ArrowRight size={14} className="ml-1" />
              </Button>
            </Link>
            <span className="text-white/50 text-xs">
              {featuredArticle.authorName} ·{" "}
              {formatDate(featuredArticle.publishedAt)}
            </span>
          </div>
        </div>
      </motion.section>

      <section>
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

        {filteredArticles.length === 0 ? (
          <div
            data-ocid="home.empty_state"
            className="text-center py-20 text-muted-foreground"
          >
            <p className="text-lg">Belum ada artikel di kategori ini.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredArticles.map((article, i) => (
              <ArticleCard
                key={article.id.toString()}
                id={article.id.toString()}
                title={article.title}
                excerpt={article.excerpt}
                coverImageUrl={article.coverImageUrl}
                category={article.category}
                authorName={article.authorName}
                publishedAt={article.publishedAt}
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
