import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { Menu, Search, X } from "lucide-react";
import { useState } from "react";
import { Category } from "../../backend";
import { CATEGORY_LABELS } from "../../data/sampleArticles";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";

const categories: { key: string; label: string }[] = [
  { key: "stock", label: CATEGORY_LABELS[Category.stock] },
  { key: "crypto", label: CATEGORY_LABELS[Category.crypto] },
  { key: "property", label: CATEGORY_LABELS[Category.property] },
  { key: "finance", label: CATEGORY_LABELS[Category.finance] },
  { key: "economicHistory", label: CATEGORY_LABELS[Category.economicHistory] },
];

export default function Navbar() {
  const { identity, clear, loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await clear();
    queryClient.clear();
    navigate({ to: "/" });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate({ to: "/" });
    }
  };

  return (
    <header className="fixed top-0 left-14 right-0 h-14 bg-card border-b border-border z-30 px-6 flex items-center gap-4">
      <Link to="/" className="flex items-center gap-2 mr-2 flex-shrink-0">
        <span className="font-display text-lg font-bold text-foreground">
          WealthLens
        </span>
      </Link>

      <nav
        className="hidden md:flex items-center gap-1 flex-1"
        data-ocid="navbar.section"
      >
        {categories.map(({ key, label }) => (
          <Link
            key={key}
            to="/category/$name"
            params={{ name: key }}
            data-ocid={`navbar.${key}.link`}
            className="px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-md hover:bg-accent"
          >
            {label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-3 ml-auto">
        <form onSubmit={handleSearch} className="hidden sm:flex items-center">
          <div className="relative">
            <Search
              size={14}
              className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              data-ocid="navbar.search_input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari artikel..."
              className="pl-8 h-8 w-44 text-sm bg-secondary border-0 focus-visible:ring-1"
            />
          </div>
        </form>

        {identity ? (
          <div className="flex items-center gap-2">
            <Link to="/profile">
              <Button
                data-ocid="navbar.profile.link"
                variant="ghost"
                size="sm"
                className="h-8 text-sm text-muted-foreground"
              >
                Profil
              </Button>
            </Link>
            <Link to="/dashboard">
              <Button
                data-ocid="navbar.dashboard.button"
                variant="outline"
                size="sm"
                className="h-8 text-sm"
              >
                Dashboard
              </Button>
            </Link>
            <Button
              data-ocid="navbar.logout.button"
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="h-8 text-sm text-muted-foreground"
            >
              Keluar
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <Link to="/login">
              <Button
                data-ocid="navbar.login.button"
                variant="ghost"
                size="sm"
                className="h-8 text-sm"
              >
                Masuk
              </Button>
            </Link>
            <Link to="/register">
              <Button
                data-ocid="navbar.register.button"
                size="sm"
                className="h-8 text-sm bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={loginStatus === "logging-in"}
              >
                {loginStatus === "logging-in" ? "Loading..." : "Gabung"}
              </Button>
            </Link>
          </div>
        )}

        <button
          type="button"
          className="md:hidden text-muted-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="absolute top-14 left-0 right-0 bg-card border-b border-border p-4 md:hidden">
          {categories.map(({ key, label }) => (
            <Link
              key={key}
              to="/category/$name"
              params={{ name: key }}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              {label}
            </Link>
          ))}
          {identity && (
            <Link
              to="/profile"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
            >
              Profil Saya
            </Link>
          )}
        </div>
      )}
    </header>
  );
}
