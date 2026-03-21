import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { Link, useNavigate } from "@tanstack/react-router";
import { Camera, Loader2, Save, User } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { UserRole } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetCallerUserProfile, useSaveProfile } from "../hooks/useQueries";
import { useStorageUpload } from "../hooks/useStorageUpload";

export default function ProfileSettingsPage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const { data: currentProfile, isLoading: profileLoading } =
    useGetCallerUserProfile();
  const saveProfile = useSaveProfile();
  const { uploadFile, isUploading, uploadProgress } = useStorageUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (currentProfile) {
      setName(currentProfile.name || "");
      setBio(currentProfile.bio || "");
      setPhotoUrl(currentProfile.photoUrl || "");
      setPreviewUrl(currentProfile.photoUrl || "");
    }
  }, [currentProfile]);

  useEffect(() => {
    if (!identity && !profileLoading) {
      navigate({ to: "/login" });
    }
  }, [identity, profileLoading, navigate]);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);
    try {
      const url = await uploadFile(file);
      setPhotoUrl(url);
      URL.revokeObjectURL(localPreview);
      setPreviewUrl(url);
      toast.success("Foto berhasil diunggah!");
    } catch {
      setPreviewUrl(photoUrl);
      toast.error("Gagal mengunggah foto.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveProfile.mutateAsync({
        name: name.trim(),
        bio: bio.trim(),
        photoUrl: photoUrl,
        role: UserRole.writer,
      });
      toast.success("Profil berhasil disimpan!");
    } catch {
      toast.error("Gagal menyimpan profil.");
    }
  };

  const initials = name
    ? name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : (identity?.getPrincipal().toString().slice(0, 2).toUpperCase() ?? "?");

  if (!identity || profileLoading) {
    return (
      <div
        data-ocid="profile.loading_state"
        className="max-w-2xl mx-auto px-6 py-16 text-center"
      >
        <Loader2
          className="animate-spin mx-auto mb-4 text-muted-foreground"
          size={32}
        />
        <p className="text-muted-foreground text-sm">Memuat profil...</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl mx-auto px-6 py-10"
    >
      <div className="mb-8">
        <h1 className="font-display text-2xl font-bold mb-1">Profil Saya</h1>
        <p className="text-muted-foreground text-sm">
          Informasi ini akan tampil di halaman profil publikmu.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6"
        data-ocid="profile.section"
      >
        {/* Avatar */}
        <div className="flex items-center gap-6">
          <div className="relative">
            <Avatar className="w-20 h-20">
              <AvatarImage src={previewUrl} alt={name || "Profil"} />
              <AvatarFallback className="text-xl bg-primary/10 text-primary font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              data-ocid="profile.upload_button"
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              <Camera size={13} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handlePhotoChange}
            />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium mb-0.5">Foto Profil</p>
            <p className="text-xs text-muted-foreground">
              Klik ikon kamera untuk mengganti foto.
            </p>
            {isUploading && (
              <div className="mt-2">
                <Progress value={uploadProgress} className="h-1.5" />
                <p className="text-xs text-muted-foreground mt-1">
                  Mengunggah... {uploadProgress}%
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Nama Tampilan</Label>
          <div className="relative">
            <User
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              data-ocid="profile.input"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nama lengkap atau nama penamu"
              className="pl-9"
              maxLength={80}
            />
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            data-ocid="profile.textarea"
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Ceritakan sedikit tentang dirimu sebagai penulis investasi..."
            rows={4}
            maxLength={300}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground text-right">
            {bio.length}/300
          </p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button
            data-ocid="profile.submit_button"
            type="submit"
            disabled={saveProfile.isPending || isUploading}
            className="gap-2"
          >
            {saveProfile.isPending ? (
              <Loader2 className="animate-spin" size={14} />
            ) : (
              <Save size={14} />
            )}
            {saveProfile.isPending ? "Menyimpan..." : "Simpan Profil"}
          </Button>
          <Link to="/dashboard">
            <Button
              data-ocid="profile.cancel_button"
              type="button"
              variant="outline"
            >
              Kembali
            </Button>
          </Link>
        </div>
      </form>
    </motion.div>
  );
}
