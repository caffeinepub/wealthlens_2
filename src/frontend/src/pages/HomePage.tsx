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

const SKETCH_SVG = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: "2.5",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": "true" as const,
};

function SketchLeft() {
  return (
    <div className="hidden md:flex flex-col items-center gap-8 absolute left-6 lg:left-12 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none select-none">
      <svg {...SKETCH_SVG} width="72" height="72" viewBox="0 0 72 72">
        <title>Bitcoin coin sketch</title>
        <circle cx="36" cy="36" r="30" />
        <circle cx="36" cy="36" r="22" strokeDasharray="4 3" />
        <path d="M30 28 h8 a5 5 0 0 1 0 10 h-8 z" />
        <path d="M30 38 h9 a5 5 0 0 1 0 10 h-9 z" />
        <line x1="33" y1="26" x2="33" y2="50" />
        <line x1="39" y1="26" x2="39" y2="50" />
      </svg>
      <svg {...SKETCH_SVG} width="80" height="44" viewBox="0 0 80 44">
        <title>Dollar bill sketch</title>
        <rect x="4" y="6" width="72" height="32" rx="3" />
        <rect x="10" y="12" width="60" height="20" rx="2" />
        <circle cx="40" cy="22" r="7" />
        <path d="M40 17 v10 M37 19 h6 M37 25 h6" />
        <line x1="4" y1="14" x2="10" y2="14" />
        <line x1="4" y1="30" x2="10" y2="30" />
        <line x1="70" y1="14" x2="76" y2="14" />
        <line x1="70" y1="30" x2="76" y2="30" />
      </svg>
    </div>
  );
}

function SketchRight() {
  return (
    <div className="hidden md:flex flex-col items-center gap-8 absolute right-6 lg:right-12 top-1/2 -translate-y-1/2 text-white/20 pointer-events-none select-none">
      <svg {...SKETCH_SVG} width="72" height="72" viewBox="0 0 72 72">
        <title>House property sketch</title>
        <polyline points="8,36 36,10 64,36" />
        <polyline points="16,30 16,62 56,62 56,30" />
        <rect x="28" y="44" width="16" height="18" />
        <rect x="20" y="36" width="10" height="10" />
        <rect x="42" y="36" width="10" height="10" />
        <line x1="36" y1="10" x2="36" y2="4" />
        <line x1="30" y1="16" x2="42" y2="16" />
      </svg>
      <svg {...SKETCH_SVG} width="52" height="72" viewBox="0 0 52 72">
        <title>Ethereum crypto sketch</title>
        <polyline points="26,4 4,36 26,28 48,36 26,4" />
        <polyline points="26,28 4,36 26,48 48,36 26,28" />
        <polyline points="26,48 4,36" />
        <polyline points="26,48 48,36" />
        <polyline points="4,36 26,68 48,36" />
      </svg>
    </div>
  );
}

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
        className="relative rounded-2xl overflow-hidden mb-10 py-16 md:py-20 flex flex-col items-center justify-center text-center"
        style={{
          backgroundImage:
            "url('/assets/uploads/20260324_105229_0000-019d1df9-d9a3-73ec-b211-bf8ce4a7f658-1.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
        data-ocid="hero.section"
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-black/55" />

        {/* Decorative sketch illustrations — hidden on mobile, flanking center text on desktop */}
        <SketchLeft />
        <SketchRight />

        <div className="relative z-10 px-6 max-w-3xl">
          {/* Label */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-8 bg-white/30" />
            <span className="text-xs font-semibold uppercase tracking-[0.25em] text-white/50">
              WealthLens
            </span>
            <div className="h-px w-8 bg-white/30" />
          </div>

          {/* Slogan */}
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight tracking-tight mb-5">
            Investasi Cerdas,{" "}
            <span className="text-white">Keputusan Tepat</span>
          </h1>

          {/* Sub-text */}
          <p className="text-sm md:text-base text-white/55 leading-relaxed mb-8 max-w-xl mx-auto">
            Temukan wawasan terdalam tentang saham, crypto, properti, dan
            ekonomi dari komunitas penulis WealthLens.
          </p>

          {/* CTA */}
          <a href="#articles">
            <Button
              data-ocid="hero.read.primary_button"
              className="bg-white text-slate-900 hover:bg-white/90 font-semibold text-sm px-6 h-11"
            >
              Mulai Membaca <ArrowRight size={14} className="ml-1.5" />
            </Button>
          </a>
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
