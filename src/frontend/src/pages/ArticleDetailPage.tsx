import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Link, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Bookmark,
  Calendar,
  Heart,
  MessageCircle,
  Tag,
  User,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { CATEGORY_LABELS, formatDate } from "../data/sampleArticles";
import { useAuthorName } from "../hooks/useAuthorName";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useGetArticle,
  useGetComments,
  useHasBookmarked,
  useHasLiked,
  usePostComment,
  useToggleBookmark,
  useToggleLike,
} from "../hooks/useQueries";

type ContentLine = {
  type: "h2" | "h3" | "bold" | "li" | "br" | "p";
  text: string;
  id: string;
};

function parseContent(content: string): ContentLine[] {
  return content.split("\n").map((line, i) => {
    const id = `line-${i}`;
    if (line.startsWith("## ")) return { type: "h2", text: line.slice(3), id };
    if (line.startsWith("### ")) return { type: "h3", text: line.slice(4), id };
    if (line.startsWith("**") && line.endsWith("**"))
      return { type: "bold", text: line.slice(2, -2), id };
    if (line.startsWith("- ")) return { type: "li", text: line.slice(2), id };
    if (line.trim() === "") return { type: "br", text: "", id };
    return { type: "p", text: line, id };
  });
}

function isNumericId(s: string): boolean {
  return /^\d+$/.test(s);
}

function CommentItem({
  c,
  index,
}: {
  c: {
    id: bigint;
    author: { toString(): string };
    content: string;
    createdAt: bigint;
  };
  index: number;
}) {
  const authorPrincipal = c.author.toString();
  const authorName = useAuthorName(authorPrincipal);
  const initials = authorName.slice(0, 2).toUpperCase();
  return (
    <div data-ocid={`article.comment.item.${index + 1}`} className="flex gap-3">
      <Avatar className="w-8 h-8">
        <AvatarFallback className="text-xs">{initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1 bg-secondary rounded-lg px-4 py-3">
        <Link
          to="/author/$principalId"
          params={{ principalId: authorPrincipal }}
          className="text-xs text-muted-foreground hover:text-foreground transition-colors mb-1 block"
        >
          {authorName}
        </Link>
        <p className="text-sm text-foreground">{c.content}</p>
      </div>
    </div>
  );
}

export default function ArticleDetailPage() {
  const { id } = useParams({ from: "/layout/article/$id" });
  const { identity } = useInternetIdentity();
  const [comment, setComment] = useState("");

  const validId = isNumericId(id);
  const { data: backendArticle, isLoading } = useGetArticle(
    validId ? BigInt(id) : BigInt(0),
  );

  const articleId = validId ? BigInt(id) : BigInt(0);
  const { data: comments = [] } = useGetComments(articleId);
  const { data: hasLiked } = useHasLiked(articleId);
  const { data: hasBookmarked } = useHasBookmarked(articleId);
  const toggleLike = useToggleLike();
  const toggleBookmark = useToggleBookmark();
  const postComment = usePostComment();

  const authorPrincipalStr = backendArticle?.author.toString() ?? null;
  const authorName = useAuthorName(authorPrincipalStr);

  const handleLike = async () => {
    if (!identity) {
      toast.error("Login untuk menyukai artikel.");
      return;
    }
    try {
      await toggleLike.mutateAsync(articleId);
    } catch {
      toast.error("Gagal memproses like.");
    }
  };

  const handleBookmark = async () => {
    if (!identity) {
      toast.error("Login untuk bookmark artikel.");
      return;
    }
    try {
      await toggleBookmark.mutateAsync(articleId);
      toast.success(
        hasBookmarked ? "Dihapus dari bookmark." : "Ditambahkan ke bookmark!",
      );
    } catch {
      toast.error("Gagal memproses bookmark.");
    }
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!identity) {
      toast.error("Login untuk berkomentar.");
      return;
    }
    if (!comment.trim()) return;
    try {
      await postComment.mutateAsync({
        articleId,
        content: comment.trim(),
      });
      setComment("");
      toast.success("Komentar berhasil dikirim!");
    } catch {
      toast.error("Gagal mengirim komentar.");
    }
  };

  if (isLoading) {
    return (
      <div
        data-ocid="article.loading_state"
        className="max-w-3xl mx-auto px-6 py-10"
      >
        <Skeleton className="h-8 w-24 mb-6" />
        <Skeleton className="h-64 rounded-xl mb-6" />
        <Skeleton className="h-8 w-3/4 mb-3" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    );
  }

  if (!validId || !backendArticle) {
    return (
      <div
        data-ocid="article.error_state"
        className="max-w-3xl mx-auto px-6 py-24 text-center"
      >
        <div className="text-5xl mb-6">📄</div>
        <h2 className="font-display text-2xl font-bold mb-3">
          Artikel Tidak Ditemukan
        </h2>
        <p className="text-muted-foreground text-sm mb-8">
          Artikel yang kamu cari mungkin sudah dihapus atau tidak tersedia.
        </p>
        <Link to="/">
          <Button data-ocid="article.back_home.primary_button">
            Kembali ke Beranda
          </Button>
        </Link>
      </div>
    );
  }

  const likeCount = backendArticle.likes.length;
  const contentLines = parseContent(backendArticle.content);
  const publishedAtStr = new Date(
    Number(backendArticle.publishedAt) / 1_000_000,
  ).toISOString();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto px-6 py-8"
    >
      <Link
        to="/"
        data-ocid="article.back.link"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft size={14} /> Kembali
      </Link>

      {backendArticle.coverImageUrl && (
        <div className="rounded-xl overflow-hidden mb-8 aspect-[16/9]">
          <img
            src={backendArticle.coverImageUrl}
            alt={backendArticle.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <span className="text-xs font-semibold uppercase tracking-wider bg-pill text-pill-foreground px-2.5 py-1 rounded-full">
          {CATEGORY_LABELS[backendArticle.category]}
        </span>
        {authorPrincipalStr && (
          <Link
            to="/author/$principalId"
            params={{ principalId: authorPrincipalStr }}
            data-ocid="article.author.link"
            className="text-xs text-muted-foreground flex items-center gap-1 hover:text-foreground transition-colors"
          >
            <User size={11} /> {authorName}
          </Link>
        )}
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Calendar size={11} /> {formatDate(publishedAtStr)}
        </span>
      </div>

      <h1 className="font-display text-2xl md:text-3xl font-bold leading-tight mb-4">
        {backendArticle.title}
      </h1>
      <p className="text-muted-foreground leading-relaxed mb-8 text-sm border-l-2 border-border pl-4 italic">
        {backendArticle.excerpt}
      </p>

      <article className="max-w-none">
        {contentLines.map(({ type, text, id: lineId }) => {
          if (type === "h2")
            return (
              <h2
                key={lineId}
                className="font-display text-xl font-bold mt-8 mb-3 text-foreground"
              >
                {text}
              </h2>
            );
          if (type === "h3")
            return (
              <h3
                key={lineId}
                className="font-display text-lg font-semibold mt-6 mb-2 text-foreground"
              >
                {text}
              </h3>
            );
          if (type === "bold")
            return (
              <p
                key={lineId}
                className="font-semibold text-foreground mt-4 mb-1"
              >
                {text}
              </p>
            );
          if (type === "li")
            return (
              <li
                key={lineId}
                className="text-muted-foreground ml-4 list-disc mb-1 text-sm"
              >
                {text}
              </li>
            );
          if (type === "br") return <br key={lineId} />;
          return (
            <p
              key={lineId}
              className="text-muted-foreground leading-relaxed mb-3 text-sm"
            >
              {text}
            </p>
          );
        })}
      </article>

      {backendArticle.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-8 pt-6 border-t border-border">
          <Tag size={14} className="text-muted-foreground mt-0.5" />
          {backendArticle.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-3 mt-6">
        <Button
          data-ocid="article.like.toggle"
          variant="outline"
          size="sm"
          onClick={handleLike}
          disabled={toggleLike.isPending}
          className={`gap-1.5 ${hasLiked ? "bg-red-50 border-red-200 text-red-600" : ""}`}
        >
          <Heart size={14} fill={hasLiked ? "currentColor" : "none"} />
          {likeCount} Suka
        </Button>
        <Button
          data-ocid="article.bookmark.toggle"
          variant="outline"
          size="sm"
          onClick={handleBookmark}
          disabled={toggleBookmark.isPending}
          className={`gap-1.5 ${hasBookmarked ? "bg-amber-50 border-amber-200 text-amber-600" : ""}`}
        >
          <Bookmark size={14} fill={hasBookmarked ? "currentColor" : "none"} />
          Simpan
        </Button>
      </div>

      <Separator className="my-8" />

      <section data-ocid="article.comments.section">
        <h3 className="font-display text-lg font-bold mb-6 flex items-center gap-2">
          <MessageCircle size={18} /> Komentar ({comments.length})
        </h3>

        {identity && (
          <form onSubmit={handleComment} className="mb-8 space-y-3">
            <Textarea
              data-ocid="article.comment.textarea"
              placeholder="Tulis komentar kamu..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="resize-none text-sm"
            />
            <Button
              data-ocid="article.comment.submit_button"
              type="submit"
              size="sm"
              disabled={postComment.isPending || !comment.trim()}
            >
              {postComment.isPending ? "Mengirim..." : "Kirim Komentar"}
            </Button>
          </form>
        )}

        {!identity && (
          <p className="text-sm text-muted-foreground mb-6">
            <Link to="/login" className="underline text-foreground">
              Login
            </Link>{" "}
            untuk meninggalkan komentar.
          </p>
        )}

        {comments.length === 0 ? (
          <div
            data-ocid="article.comments.empty_state"
            className="text-center py-10 text-muted-foreground text-sm"
          >
            Belum ada komentar. Jadilah yang pertama!
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((c, i) => (
              <CommentItem key={c.id.toString()} c={c} index={i} />
            ))}
          </div>
        )}
      </section>
    </motion.div>
  );
}
