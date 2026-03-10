import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  FolderOpen,
  LayoutDashboard,
  PlusCircle,
  Settings,
  Users,
} from "lucide-react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ collapsed, onToggle }) => {
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);

  const navItems = [
    { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/dashboard/my-posts", label: "My Posts", icon: FileText },
    { to: "/dashboard/create-post", label: "Create Post", icon: PlusCircle },
    { to: "/dashboard/profile", label: "Profile", icon: Settings },
  ];

  const adminItems = [
    { to: "/dashboard/admin/posts", label: "All Posts", icon: FileText },
    { to: "/dashboard/admin/users", label: "Users", icon: Users },
    {
      to: "/dashboard/admin/categories",
      label: "Categories",
      icon: FolderOpen,
    },
  ];

  const isActive = (path) => {
    if (path === "/dashboard") {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <aside
      className={cn(
        "hidden md:flex flex-col border-r bg-card transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex items-center justify-between h-16 border-b px-4">
        {!collapsed && <span className="font-semibold">Dashboard</span>}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggle}
          className={cn("h-8 w-8", collapsed && "mx-auto")}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      <nav className="flex-1 p-2 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
              isActive(item.to)
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-primary hover:bg-accent",
              collapsed && "justify-center px-2",
            )}
            title={collapsed ? item.label : undefined}
          >
            <item.icon className="h-5 w-5 shrink-0" />
            {!collapsed && <span>{item.label}</span>}
          </Link>
        ))}

        {user?.role === "admin" && (
          <>
            <div
              className={cn(
                "pt-4 pb-2 text-xs font-semibold text-muted-foreground uppercase",
                collapsed ? "text-center" : "px-3",
              )}
            >
              {collapsed ? "—" : "Admin"}
            </div>
            {adminItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 transition-all",
                  isActive(item.to)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-primary hover:bg-accent",
                  collapsed && "justify-center px-2",
                )}
                title={collapsed ? item.label : undefined}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            ))}
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;
