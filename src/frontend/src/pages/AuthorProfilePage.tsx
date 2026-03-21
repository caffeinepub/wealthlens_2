import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Principal } from "@icp-sdk/core/principal";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft, FileText, User } from "lucide-react";
import { motion } from "motion/react";
import { useMemo } from "react";
import ArticleCard from "../components/ArticleCard";
import { formatDate } from "../data/sampleArticles";
import { useActor } from "../hooks/useActor";
import { useGetAuthorArticles, useGetAuthorProfile } from "../hooks/useQueries";

export default function AuthorProfilePage() {
  const { principalId } = useParams({ from: "/layout/author/$principalId" });

  const isValidPrincipal = useMemo(() => {
    try {
      Principal.fromText(principalId);
      return true;
    } catch {
      return false;
    }
  }, [principalId]);

  const { actor } = useActor();
  const { data: profile, isLoading: profileLoading } = useGetAuthorProfile(
    isValidPrincipal ? principalId : null,
  );
  const { data: articles = [], isLoading: articlesLoading } =
    useGetAuthorArticles(isValidPrincipal ? principalId : null);

  const isLoading = !actor || profileLoading;

  const displayName = profile?.name || `${principalId.slice(0, 16)}...`;
  const initials = (profile?.name || principalId)
    .split(" ")
    .map((w: string) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (!isValidPrincipal) {
    return (
      <div
        data-ocid="author.error_state"
        className="max-w-3xl mx-auto px-6 py-24 text-center"
      >
        <User
          size={40}
          className="mx-auto mb-4 text-muted-foreground opacity-40"
        />
        <h2 className="font-display text-2xl font-bold mb-3">
          Penulis Tidak Ditemukan
        </h2>
        <p className="text-muted-foreground text-sm mb-8">
          Profil penulis yang kamu cari tidak tersedia.
        </p>
        <Link to="/">
          <Button data-ocid="author.back.primary_button">
            Kembali ke Beranda
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-5xl mx-auto px-6 py-10"
    >
      <Link
        to="/"
        data-ocid="author.back.link"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <ArrowLeft size={14} /> Kembali
      </Link>

      {/* Profile Card */}
      <div
        data-ocid="author.card"
        className="bg-card rounded-2xl p-6 md:p-8 mb-10 shadow-card flex flex-col sm:flex-row items-start sm:items-center gap-6"
      >
        {isLoading ? (
          <>
            <Skeleton className="w-20 h-20 rounded-full flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-full max-w-sm" />
              <Skeleton className="h-4 w-full max-w-xs" />
            </div>
          </>
        ) : profile === null ? (
          <div
            data-ocid="author.profile.empty_state"
            className="flex-1 text-center py-4"
          >
            <User
              size={36}
              className="mx-auto mb-3 text-muted-foreground opacity-40"
            />
            <p className="text-muted-foreground text-sm">
              Profil penulis belum dilengkapi.
            </p>
          </div>
        ) : (
          <>
            <Avatar className="w-20 h-20 flex-shrink-0">
              <AvatarImage src={profile!.photoUrl} alt={displayName} />
              <AvatarFallback className="text-2xl bg-primary/10 text-primary font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <h1 className="font-display text-2xl font-bold mb-1">
                {displayName}
              </h1>
              {profile!.bio && (
                <p className="text-muted-foreground text-sm leading-relaxed max-w-prose">
                  {profile!.bio}
                </p>
              )}
              {!profile!.bio && (
                <p className="text-muted-foreground/60 text-sm italic">
                  Belum ada bio.
                </p>
              )}
            </div>
          </>
        )}
      </div>

      {/* Articles */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <FileText size={18} className="text-muted-foreground" />
          <h2 className="font-display text-xl font-bold">
            Artikel oleh penulis ini
          </h2>
        </div>

        {articlesLoading ? (
          <div
            data-ocid="author.articles.loading_state"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-72 rounded-xl" />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div
            data-ocid="author.articles.empty_state"
            className="text-center py-16 text-muted-foreground"
          >
            <FileText size={36} className="mx-auto mb-4 opacity-30" />
            <p className="text-sm">Penulis ini belum memiliki artikel.</p>
          </div>
        ) : (
          <div
            data-ocid="author.articles.list"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {articles.map((article, i) => (
              <ArticleCard
                key={article.id.toString()}
                id={article.id.toString()}
                title={article.title}
                excerpt={article.excerpt}
                coverImageUrl={article.coverImageUrl}
                category={article.category}
                authorName={
                  profile?.name || article.author.toString().slice(0, 12)
                }
                authorPrincipal={article.author.toString()}
                publishedAt={formatDate(
                  new Date(
                    Number(article.publishedAt) / 1_000_000,
                  ).toISOString(),
                )}
                index={i}
                ocidPrefix="author.article"
              />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
