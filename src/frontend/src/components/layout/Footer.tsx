import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiInstagram, SiLinkedin, SiX, SiYoutube } from "react-icons/si";
import { toast } from "sonner";

const categoryLinks = [
  { to: "/category/stock", label: "Saham" },
  { to: "/category/crypto", label: "Crypto" },
  { to: "/category/property", label: "Properti" },
  { to: "/category/finance", label: "Keuangan" },
  { to: "/category/economicHistory", label: "Sejarah Ekonomi" },
];

const socialLinks = [
  { href: "https://x.com", label: "X / Twitter", icon: SiX },
  { href: "https://instagram.com", label: "Instagram", icon: SiInstagram },
  { href: "https://youtube.com", label: "YouTube", icon: SiYoutube },
  { href: "https://linkedin.com", label: "LinkedIn", icon: SiLinkedin },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const currentYear = new Date().getFullYear();

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Berhasil! Cek email kamu untuk konfirmasi.");
    setEmail("");
  };

  return (
    <footer className="bg-primary text-primary-foreground mt-16">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <h2 className="font-display text-xl font-bold mb-3">WealthLens</h2>
            <p className="text-primary-foreground/60 text-sm leading-relaxed">
              Platform edukasi keuangan dan investasi terpercaya untuk investor
              Indonesia.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-4 text-primary-foreground/80 uppercase tracking-widest">
              Kategori
            </h3>
            <ul className="space-y-2">
              {categoryLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-4 text-primary-foreground/80 uppercase tracking-widest">
              Ikuti Kami
            </h3>
            <div className="flex gap-3">
              {socialLinks.map(({ href, label, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-4 text-primary-foreground/80 uppercase tracking-widest">
              Newsletter
            </h3>
            <p className="text-sm text-primary-foreground/60 mb-3">
              Dapatkan insight terbaru langsung di inbox kamu.
            </p>
            <form onSubmit={handleNewsletter} className="flex gap-2">
              <Input
                data-ocid="footer.newsletter.input"
                type="email"
                placeholder="email@kamu.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-8 text-sm bg-primary-foreground/10 border-primary-foreground/20 text-primary-foreground placeholder:text-primary-foreground/40"
              />
              <Button
                data-ocid="footer.newsletter.submit_button"
                type="submit"
                size="sm"
                className="h-8 bg-primary-foreground text-primary hover:bg-primary-foreground/90 text-xs flex-shrink-0"
              >
                Daftar
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-10 pt-6 text-center text-xs text-primary-foreground/40">
          © {currentYear}.{" "}
          <a
            href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
            className="hover:text-primary-foreground/60 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            Built with love using caffeine.ai
          </a>
        </div>
      </div>
    </footer>
  );
}
