import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";
import { Edit2, Eye, FileText, Plus, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { CATEGORY_LABELS, formatDate } from "../data/sampleArticles";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useDeleteArticle, useGetMyArticles } from "../hooks/useQueries";

export default function DashboardPage() {
  const { identity } = useInternetIdentity();
  const { data: backendArticles, isLoading } = useGetMyArticles();
  const deleteArticle = useDeleteArticle();

  if (!identity) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <FileText size={40} className="mx-auto text-muted-foreground mb-4" />
        <h2 className="font-display text-2xl mb-3">Login diperlukan</h2>
        <p className="text-muted-foreground text-sm mb-6">
          Masuk untuk mengakses dashboard penulis kamu.
        </p>
        <Link to="/login">
          <Button data-ocid="dashboard.login.primary_button">
            Masuk Sekarang
          </Button>
        </Link>
      </div>
    );
  }

  const articles = backendArticles ?? [];

  const handleDelete = async (id: bigint) => {
    try {
      await deleteArticle.mutateAsync(id);
      toast.success("Artikel berhasil dihapus.");
    } catch {
      toast.error("Gagal menghapus artikel.");
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl font-bold">
              Dashboard Penulis
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Kelola artikel kamu
            </p>
          </div>
          <Link to="/article/new">
            <Button
              data-ocid="dashboard.create.primary_button"
              className="gap-2"
            >
              <Plus size={16} /> Artikel Baru
            </Button>
          </Link>
        </div>

        {isLoading ? (
          <div data-ocid="dashboard.loading_state" className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 rounded-xl" />
            ))}
          </div>
        ) : articles.length === 0 ? (
          <div
            data-ocid="dashboard.empty_state"
            className="text-center py-20 text-muted-foreground"
          >
            <FileText size={36} className="mx-auto mb-4 opacity-40" />
            <p className="text-lg font-medium mb-2">Belum ada artikel</p>
            <p className="text-sm mb-6">Mulai tulis artikel pertama kamu!</p>
            <Link to="/article/new">
              <Button data-ocid="dashboard.create_first.primary_button">
                Buat Artikel
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {articles.map((article, i) => {
              const id = article.id;
              const publishedAt = new Date(
                Number(article.publishedAt) / 1_000_000,
              ).toISOString();

              return (
                <motion.div
                  key={id.toString()}
                  data-ocid={`dashboard.article.item.${i + 1}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-card rounded-xl p-4 flex items-center gap-4 shadow-card hover:shadow-card-hover transition-shadow"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className="text-xs">
                        {CATEGORY_LABELS[article.category]}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(publishedAt)}
                      </span>
                    </div>
                    <h3 className="font-semibold text-sm text-foreground truncate">
                      {article.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Link to="/article/$id" params={{ id: id.toString() }}>
                      <Button
                        data-ocid={`dashboard.view.button.${i + 1}`}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <Eye size={14} />
                      </Button>
                    </Link>
                    <Link to="/article/edit/$id" params={{ id: id.toString() }}>
                      <Button
                        data-ocid={`dashboard.edit.button.${i + 1}`}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                      >
                        <Edit2 size={14} />
                      </Button>
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          data-ocid={`dashboard.delete_button.${i + 1}`}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent data-ocid="dashboard.delete.dialog">
                        <AlertDialogHeader>
                          <AlertDialogTitle>Hapus Artikel?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tindakan ini tidak bisa dibatalkan. Artikel akan
                            dihapus permanen.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel data-ocid="dashboard.delete.cancel_button">
                            Batal
                          </AlertDialogCancel>
                          <AlertDialogAction
                            data-ocid="dashboard.delete.confirm_button"
                            onClick={() => handleDelete(id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Hapus
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
}
