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

export default function ProfileSetupModal() {
  const { identity } = useInternetIdentity();
  const { data: userProfile, isLoading, isFetched } = useGetCallerUserProfile();
  const saveProfile = useSaveProfile();
  const [name, setName] = useState("");
  const [role, setRole] = useState<UserRole>(UserRole.reader);

  // Use loose equality to catch both null and undefined
  const showModal =
    !!identity && !isLoading && isFetched && userProfile == null;

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
    } catch {
      toast.error("Gagal menyimpan profil.");
    }
  };

  return (
    <Dialog open={showModal}>
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
