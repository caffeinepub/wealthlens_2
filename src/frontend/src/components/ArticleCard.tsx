import { Badge } from "@/components/ui/badge";
import { Link } from "@tanstack/react-router";
import { Calendar, User } from "lucide-react";
import { motion } from "motion/react";
import type { Category } from "../backend";
import { CATEGORY_LABELS, formatDate } from "../data/sampleArticles";

interface ArticleCardProps {
  id: string;
  title: string;
  excerpt: string;
  coverImageUrl: string;
  category: Category;
  authorName: string;
  publishedAt: string;
  index?: number;
  ocidPrefix?: string;
}

const CATEGORY_PILL_COLORS: Record<string, string> = {
  stock: "bg-emerald-600",
  crypto: "bg-orange-500",
  property: "bg-blue-600",
  finance: "bg-violet-600",
  economicHistory: "bg-amber-600",
};

export default function ArticleCard({
  id,
  title,
  excerpt,
  coverImageUrl,
  category,
  authorName,
  publishedAt,
  index = 0,
  ocidPrefix = "article",
}: ArticleCardProps) {
  const catKey = category as string;
  const pillColor = CATEGORY_PILL_COLORS[catKey] || "bg-primary";

  return (
    <motion.article
      data-ocid={`${ocidPrefix}.item.${index + 1}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.07 }}
      className="group bg-card rounded-xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300 flex flex-col"
    >
      <Link
        to="/article/$id"
        params={{ id }}
        className="block overflow-hidden relative aspect-[16/9]"
      >
        <img
          src={coverImageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <span
          className={`absolute top-3 left-3 text-[11px] font-semibold uppercase tracking-wider text-white px-2.5 py-1 rounded-full ${pillColor}`}
        >
          {CATEGORY_LABELS[category]}
        </span>
      </Link>

      <div className="p-4 flex flex-col flex-1">
        <Link to="/article/$id" params={{ id }} className="block flex-1">
          <h3 className="font-display font-bold text-base leading-snug text-foreground line-clamp-2 mb-2 group-hover:text-primary/80 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {excerpt}
          </p>
        </Link>

        <div className="flex items-center gap-3 mt-4 pt-3 border-t border-border text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <User size={11} />
            {authorName}
          </span>
          <span className="flex items-center gap-1 ml-auto">
            <Calendar size={11} />
            {formatDate(publishedAt)}
          </span>
        </div>
      </div>
    </motion.article>
  );
}
