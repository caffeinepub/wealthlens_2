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
  TrendingUp,
} from "lucide-react";

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

  return (
    <aside className="fixed left-0 top-0 h-screen w-14 bg-sidebar flex flex-col items-center pt-3 pb-6 z-40 border-r border-sidebar-border">
      <Link to="/" className="mb-8 h-8 flex items-center justify-center">
        <div className="w-9 h-9 bg-white rounded-sm flex items-center justify-center shadow-sm">
          <span className="text-gray-900 font-display text-xs font-bold">
            W
          </span>
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
      </TooltipProvider>
    </aside>
  );
}
