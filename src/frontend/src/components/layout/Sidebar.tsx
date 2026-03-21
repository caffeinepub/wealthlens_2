import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link, useLocation } from "@tanstack/react-router";
import {
  BarChart2,
  Bookmark,
  Home,
  LayoutDashboard,
  LogIn,
  TrendingUp,
} from "lucide-react";
import { useInternetIdentity } from "../../hooks/useInternetIdentity";

type NavItem =
  | {
      to: "/" | "/bookmarks" | "/dashboard";
      icon: React.ElementType;
      label: string;
    }
  | {
      to: "/category/$name";
      params: { name: string };
      icon: React.ElementType;
      label: string;
    };

const navItems: NavItem[] = [
  { to: "/", icon: Home, label: "Beranda" },
  {
    to: "/category/$name",
    params: { name: "stock" },
    icon: TrendingUp,
    label: "Saham",
  },
  {
    to: "/category/$name",
    params: { name: "crypto" },
    icon: BarChart2,
    label: "Crypto",
  },
  { to: "/bookmarks", icon: Bookmark, label: "Bookmark" },
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
];

export default function Sidebar() {
  const location = useLocation();
  const { identity, login, loginStatus } = useInternetIdentity();

  return (
    <aside className="fixed left-0 top-0 h-screen w-14 bg-sidebar flex flex-col items-center py-6 z-40 border-r border-sidebar-border">
      <Link to="/" className="mb-8">
        <div className="w-8 h-8 bg-sidebar-foreground rounded-sm flex items-center justify-center">
          <span className="text-sidebar font-display text-xs font-bold">W</span>
        </div>
      </Link>

      <TooltipProvider delayDuration={100}>
        <nav className="flex flex-col gap-2 flex-1">
          {navItems.map((item) => {
            const params = "params" in item ? item.params : undefined;
            const isActive =
              item.to === "/"
                ? location.pathname === "/"
                : params
                  ? location.pathname.startsWith(`/category/${params.name}`)
                  : location.pathname.startsWith(item.to);
            return (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                  <Link
                    to={item.to as any}
                    params={params as any}
                    data-ocid={`sidebar.${item.label.toLowerCase().replace(/ /g, "_")}.link`}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                      isActive
                        ? "bg-sidebar-foreground/20 text-sidebar-foreground"
                        : "text-sidebar-foreground/50 hover:text-sidebar-foreground hover:bg-sidebar-foreground/10"
                    }`}
                  >
                    <item.icon size={18} />
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right" className="text-xs">
                  {item.label}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </nav>

        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              data-ocid="sidebar.login.toggle"
              onClick={() => !identity && login()}
              disabled={loginStatus === "logging-in"}
              className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors mt-auto ${
                identity
                  ? "bg-sidebar-foreground/20 text-sidebar-foreground"
                  : "text-sidebar-foreground/40 hover:text-sidebar-foreground hover:bg-sidebar-foreground/10"
              }`}
            >
              <LogIn size={18} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="text-xs">
            {identity ? "Masuk" : "Login"}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </aside>
  );
}
