import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import { BookOpen, PenSquare, TrendingUp, Users } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

const benefits = [
  {
    id: "read",
    icon: BookOpen,
    text: "Baca artikel eksklusif dari penulis terpilih",
  },
  {
    id: "write",
    icon: PenSquare,
    text: "Tulis dan publikasikan insight investasi kamu",
  },
  {
    id: "community",
    icon: Users,
    text: "Bergabung dengan komunitas investor aktif",
  },
];

export default function RegisterPage() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const navigate = useNavigate();

  useEffect(() => {
    if (identity) navigate({ to: "/" });
  }, [identity, navigate]);

  const isLoggingIn = loginStatus === "logging-in";

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-6 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
        data-ocid="register.section"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <TrendingUp size={22} className="text-primary-foreground" />
          </div>
          <h1 className="font-display text-2xl font-bold mb-2">
            Bergabung dengan WealthLens
          </h1>
          <p className="text-muted-foreground text-sm">
            Platform edukasi investasi terpercaya Indonesia
          </p>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-card space-y-6">
          <div className="space-y-3">
            {benefits.map(({ id, icon: Icon, text }) => (
              <div key={id} className="flex items-center gap-3">
                <div className="w-8 h-8 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon size={14} className="text-muted-foreground" />
                </div>
                <p className="text-sm text-foreground">{text}</p>
              </div>
            ))}
          </div>

          <Button
            data-ocid="register.submit.primary_button"
            onClick={login}
            disabled={isLoggingIn}
            className="w-full h-11 text-sm font-semibold"
          >
            {isLoggingIn
              ? "Menghubungkan..."
              : "Daftar dengan Internet Identity"}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Sudah punya akun?{" "}
            <Link to="/login" className="text-foreground underline">
              Masuk di sini
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
