import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useState } from "react";
import { toast } from "sonner";
import { UserRole } from "../backend";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { useGetCallerUserProfile, useSaveProfile } from "../hooks/useQueries";

function getProfileErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    const msg = error.message;
    if (msg.includes("not authorized") || msg.includes("Unauthorized")) {
      return "Kamu tidak memiliki izin. Coba logout dan login ulang.";
    }
    if (msg.includes("guest")) {
      return "Sesi login tidak valid. Coba logout dan login ulang.";
    }
    if (msg.toLowerCase().includes("actor")) {
      return "Koneksi ke backend bermasalah. Refresh halaman dan coba lagi.";
    }
    return `Gagal menyimpan profil: ${msg}`;
  }
  return "Gagal menyimpan profil. Coba lagi.";
}

export default function ProfileSetupModal() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading, isFetched } = useGetCallerUserProfile();
  const saveProfile = useSaveProfile();
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>(UserRole.reader);
  const [dismissed, setDismissed] = useState(false);

  // Use loose equality to catch both null and undefined
  const showModal =
    !!identity && !isLoading && isFetched && userProfile == null && !dismissed;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await saveProfile.mutateAsync({
        name: name.trim(),
        role,
        bio: "",
        photoUrl: "",
      });
      toast.success("Profil berhasil dibuat!");
    } catch (error) {
      toast.error(getProfileErrorMessage(error), { duration: 6000 });
    }
  };

  return (
    <Dialog
      open={showModal}
      onOpenChange={(open) => {
        if (!open) setDismissed(true);
      }}
    >
      <DialogContent data-ocid="profile_setup.dialog" className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-xl">
            Selamat Datang di WealthLens!
          </DialogTitle>
          <DialogDescription>
            Lengkapi profil kamu untuk mulai membaca dan berkontribusi.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input
              data-ocid="profile_setup.name.input"
              id="name"
              placeholder="Masukkan nama kamu"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Peran Kamu</Label>
            <RadioGroup
              value={role}
              onValueChange={(v) => setRole(v as UserRole)}
              className="flex gap-4"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem
                  data-ocid="profile_setup.reader.radio"
                  value={UserRole.reader}
                  id="reader"
                />
                <Label htmlFor="reader" className="cursor-pointer">
                  Pembaca
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem
                  data-ocid="profile_setup.writer.radio"
                  value={UserRole.writer}
                  id="writer"
                />
                <Label htmlFor="writer" className="cursor-pointer">
                  Penulis
                </Label>
              </div>
            </RadioGroup>
          </div>
          <Button
            data-ocid="profile_setup.submit_button"
            type="submit"
            className="w-full"
            disabled={saveProfile.isPending || !name.trim()}
          >
            {saveProfile.isPending ? "Menyimpan..." : "Mulai Sekarang"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
