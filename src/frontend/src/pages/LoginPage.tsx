import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "@tanstack/react-router";
import { Lock, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";

export default function LoginPage() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const navigate = useNavigate();

  useEffect(() => {
    if (identity) navigate({ to: "/" });
  }, [identity, navigate]);

  const isLoggingIn = loginStatus === "logging-in";

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
        data-ocid="login.section"
      >
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mx-auto mb-4">
            <TrendingUp size={22} className="text-primary-foreground" />
          </div>
          <h1 className="font-display text-2xl font-bold mb-2">
            Masuk ke WealthLens
          </h1>
          <p className="text-muted-foreground text-sm">
            Bergabung dengan komunitas investor Indonesia
          </p>
        </div>

        <div className="bg-card rounded-2xl p-6 shadow-card space-y-4">
          <div className="flex items-start gap-3 p-3 bg-secondary rounded-lg">
            <Lock
              size={16}
              className="text-muted-foreground mt-0.5 flex-shrink-0"
            />
            <p className="text-xs text-muted-foreground leading-relaxed">
              WealthLens menggunakan{" "}
              <strong className="text-foreground">Internet Identity</strong> —
              sistem autentikasi terdesentralisasi yang aman tanpa password.
            </p>
          </div>

          <Button
            data-ocid="login.submit.primary_button"
            onClick={login}
            disabled={isLoggingIn}
            className="w-full h-11 text-sm font-semibold"
          >
            {isLoggingIn
              ? "Menghubungkan..."
              : "Masuk dengan Internet Identity"}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Belum punya akun?{" "}
            <Link to="/register" className="text-foreground underline">
              Daftar sekarang
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          Dengan masuk, kamu menyetujui{" "}
          <span className="underline cursor-pointer">Syarat & Ketentuan</span>{" "}
          dan{" "}
          <span className="underline cursor-pointer">Kebijakan Privasi</span>{" "}
          kami.
        </p>
      </motion.div>
    </div>
  );
}
