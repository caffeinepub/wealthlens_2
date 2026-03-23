import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  BarChart2,
  Bookmark,
  Home,
  LayoutDashboard,
  Menu,
  Search,
  TrendingUp,
  User,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";

const navItems = [
  { icon: Home, label: "Beranda", to: "/" },
  { icon: TrendingUp, label: "Saham", to: "/category/stock" },
  { icon: BarChart2, label: "Crypto", to: "/category/crypto" },
  { icon: Bookmark, label: "Bookmark", to: "/bookmarks" },
  { icon: LayoutDashboard, label: "Dashboard", to: "/dashboard" },
];

export default function Navbar() {
  const { identity, clear, loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 h-14 bg-card border-b border-border z-30 px-4 flex items-center gap-3">
      {/* Hamburger dropdown */}
      <div className="relative flex-shrink-0" ref={dropdownRef}>
        <button
          type="button"
          data-ocid="navbar.command_palette_open"
          onClick={() => setDropdownOpen((prev) => !prev)}
          className="flex items-center justify-center w-8 h-8 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          aria-label="Menu navigasi"
        >
          <Menu size={18} />
        </button>

        {dropdownOpen && (
          <div className="absolute top-full left-0 mt-1 w-48 bg-card border border-border rounded-lg shadow-lg z-50 py-1">
            {navItems.map(({ icon: Icon, label, to }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
              >
                <Icon size={15} />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Brand */}
      <Link to="/" className="flex items-center gap-2 flex-shrink-0">
        <span className="font-display text-lg font-bold text-foreground">
          WealthLens
        </span>
      </Link>

      {/* Right side */}
      <div className="flex items-center gap-3 ml-auto">
        <form onSubmit={handleSearch} className="hidden sm:flex items-center">
          <div className="relative h-8 flex items-center">
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
                size="icon"
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                title="Profil"
              >
                <User size={16} />
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

        {/* W logo - far right */}
        <div className="w-9 h-9 bg-white rounded-sm flex items-center justify-center shadow-sm flex-shrink-0">
          <span className="text-gray-900 font-display text-xs font-bold">
            W
          </span>
        </div>
      </div>
    </header>
  );
}
