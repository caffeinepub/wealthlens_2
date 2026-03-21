import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Loader2 } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Category } from "../backend";
import MarkdownEditor from "../components/MarkdownEditor";
import { CATEGORY_LABELS, SAMPLE_ARTICLES } from "../data/sampleArticles";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useCreateArticle,
  useGetArticle,
  useUpdateArticle,
} from "../hooks/useQueries";

interface ArticleForm {
  title: string;
  excerpt: string;
  content: string;
  category: Category;
  coverImageUrl: string;
  tags: string;
}

const DEFAULT_FORM: ArticleForm = {
  title: "",
  excerpt: "",
  content: "",
  category: Category.finance,
  coverImageUrl: "",
  tags: "",
};

export default function CreateEditArticlePage() {
  const params = useParams({
    from: "/layout/article/edit/$id",
    shouldThrow: false,
  }) as { id?: string };
  const id = params?.id;
  const isEdit = !!id;
  const navigate = useNavigate();
  const { identity } = useInternetIdentity();
  const [form, setForm] = useState<ArticleForm>(DEFAULT_FORM);

  const { data: backendArticle } = useGetArticle(
    isEdit ? BigInt(id!) : BigInt(0),
  );
  const sampleArticle = isEdit
    ? SAMPLE_ARTICLES.find((a) => a.id.toString() === id)
    : undefined;
  const existingArticle = backendArticle || sampleArticle;

  const createArticle = useCreateArticle();
  const updateArticle = useUpdateArticle();

  useEffect(() => {
    if (existingArticle) {
      setForm({
        title: existingArticle.title,
        excerpt: existingArticle.excerpt,
        content: existingArticle.content,
        category: existingArticle.category,
        coverImageUrl: existingArticle.coverImageUrl,
        tags: "tags" in existingArticle ? existingArticle.tags.join(", ") : "",
      });
    }
  }, [existingArticle]);

  if (!identity) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-20 text-center">
        <h2 className="font-display text-2xl mb-3">Login diperlukan</h2>
        <Link to="/login">
          <Button>Masuk</Button>
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const input = {
      title: form.title,
      excerpt: form.excerpt,
      content: form.content,
      category: form.category,
      coverImageUrl: form.coverImageUrl,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };
    try {
      if (isEdit && id) {
        await updateArticle.mutateAsync({ id: BigInt(id), input });
        toast.success("Artikel berhasil diperbarui!");
      } else {
        await createArticle.mutateAsync(input);
        toast.success("Artikel berhasil dipublikasikan!");
      }
      navigate({ to: "/dashboard" });
    } catch {
      toast.error("Gagal menyimpan artikel.");
    }
  };

  const isPending = createArticle.isPending || updateArticle.isPending;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="max-w-3xl mx-auto px-6 py-8"
    >
      <Link
        to="/dashboard"
        data-ocid="create_article.back.link"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ArrowLeft size={14} /> Dashboard
      </Link>

      <h1 className="font-display text-2xl font-bold mb-8">
        {isEdit ? "Edit Artikel" : "Tulis Artikel Baru"}
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="title">Judul Artikel *</Label>
          <Input
            data-ocid="create_article.title.input"
            id="title"
            placeholder="Masukkan judul artikel yang menarik..."
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Kategori *</Label>
            <Select
              value={form.category}
              onValueChange={(v) =>
                setForm((p) => ({ ...p, category: v as Category }))
              }
            >
              <SelectTrigger
                data-ocid="create_article.category.select"
                id="category"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(Category).map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {CATEGORY_LABELS[cat]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="coverImageUrl">URL Gambar Cover</Label>
            <Input
              data-ocid="create_article.cover_image.input"
              id="coverImageUrl"
              placeholder="https://..."
              value={form.coverImageUrl}
              onChange={(e) =>
                setForm((p) => ({ ...p, coverImageUrl: e.target.value }))
              }
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="excerpt">Ringkasan *</Label>
          <Textarea
            data-ocid="create_article.excerpt.textarea"
            id="excerpt"
            placeholder="Tulis ringkasan singkat artikel (1-2 kalimat)..."
            value={form.excerpt}
            onChange={(e) =>
              setForm((p) => ({ ...p, excerpt: e.target.value }))
            }
            rows={2}
            required
          />
        </div>

        <div className="space-y-2">
          <Label>Konten Artikel *</Label>
          <MarkdownEditor
            data-ocid="create_article.content.textarea"
            value={form.content}
            onChange={(v) => setForm((p) => ({ ...p, content: v }))}
            placeholder="Tulis artikel kamu di sini... Gunakan toolbar di atas untuk format teks."
            required
          />
          <p className="text-xs text-muted-foreground">
            Gunakan toolbar untuk Bold, Italic, Heading, Link, Gambar, dan
            format lainnya. Konten disimpan sebagai Markdown.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tag (pisahkan dengan koma)</Label>
          <Input
            data-ocid="create_article.tags.input"
            id="tags"
            placeholder="investasi, saham, pemula"
            value={form.tags}
            onChange={(e) => setForm((p) => ({ ...p, tags: e.target.value }))}
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Button
            data-ocid="create_article.submit.primary_button"
            type="submit"
            disabled={isPending}
            className="flex-1"
          >
            {isPending ? (
              <>
                <Loader2 size={14} className="mr-2 animate-spin" /> Menyimpan...
              </>
            ) : isEdit ? (
              "Perbarui Artikel"
            ) : (
              "Publikasikan Artikel"
            )}
          </Button>
          <Link to="/dashboard">
            <Button
              data-ocid="create_article.cancel.secondary_button"
              type="button"
              variant="outline"
            >
              Batal
            </Button>
          </Link>
        </div>
      </form>
    </motion.div>
  );
}
