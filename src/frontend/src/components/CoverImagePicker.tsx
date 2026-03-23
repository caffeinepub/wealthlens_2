import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ImageIcon, Link2, Loader2, Upload, X } from "lucide-react";
import { useRef, useState } from "react";

interface CoverImagePickerProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function CoverImagePicker({
  value,
  onChange,
  label = "Gambar Cover",
}: CoverImagePickerProps) {
  const [mode, setMode] = useState<"upload" | "url">("upload");
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError(null);
    setUploading(true);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Gagal membaca file."));
        reader.readAsDataURL(file);
      });
      onChange(dataUrl);
    } catch (err) {
      setUploadError(
        err instanceof Error ? err.message : "Gagal mengupload gambar.",
      );
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleClear = () => {
    onChange("");
    setUploadError(null);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    e.currentTarget.style.display = "none";
  };

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      {/* Tab Switcher */}
      <div className="flex rounded-md border overflow-hidden w-fit">
        <button
          type="button"
          onClick={() => setMode("upload")}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-sm transition-colors ${
            mode === "upload"
              ? "bg-primary text-primary-foreground"
              : "bg-background text-muted-foreground hover:text-foreground"
          }`}
        >
          <Upload size={13} /> Upload
        </button>
        <button
          type="button"
          onClick={() => setMode("url")}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-sm transition-colors ${
            mode === "url"
              ? "bg-primary text-primary-foreground"
              : "bg-background text-muted-foreground hover:text-foreground"
          }`}
        >
          <Link2 size={13} /> URL
        </button>
      </div>

      {/* Upload Mode */}
      {mode === "upload" && (
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
          {!value ? (
            <button
              type="button"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="w-full border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary/60 hover:bg-muted/30 transition-colors disabled:cursor-not-allowed"
            >
              {uploading ? (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Loader2 size={24} className="animate-spin" />
                  <span className="text-sm">Memproses gambar...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <ImageIcon size={24} />
                  <span className="text-sm">Klik untuk pilih gambar</span>
                  <span className="text-xs">JPG, PNG, WebP, GIF</span>
                </div>
              )}
            </button>
          ) : (
            <div className="relative group">
              <img
                src={value}
                alt="Cover preview"
                className="w-full h-40 object-cover rounded-lg border"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? (
                    <Loader2 size={13} className="animate-spin" />
                  ) : (
                    <Upload size={13} />
                  )}
                  Ganti
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="destructive"
                  onClick={handleClear}
                >
                  <X size={13} /> Hapus
                </Button>
              </div>
            </div>
          )}
          {uploadError && (
            <p className="text-xs text-destructive mt-1">{uploadError}</p>
          )}
        </div>
      )}

      {/* URL Mode */}
      {mode === "url" && (
        <div className="space-y-2">
          <Input
            placeholder="https://example.com/gambar.jpg"
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          {value && (
            <div className="relative group">
              <img
                src={value}
                alt="Cover preview"
                className="w-full h-40 object-cover rounded-lg border"
                onError={handleImageError}
              />
              <button
                type="button"
                onClick={handleClear}
                className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X size={12} />
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
