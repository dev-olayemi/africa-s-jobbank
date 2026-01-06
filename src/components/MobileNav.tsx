import { Link, useLocation } from "react-router-dom";
import { Home, Search, PlusSquare, Bell, User } from "lucide-react";

const MobileNav = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/dashboard", icon: Home, label: "Home" },
    { path: "/jobs", icon: Search, label: "Search" },
    { path: "/create", icon: PlusSquare, label: "Post", isCenter: true },
    { path: "/notifications", icon: Bell, label: "Alerts" },
    { path: "/profile", icon: User, label: "Profile" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass border-t border-border safe-bottom">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
              item.isCenter ? "" : ""
            } ${isActive(item.path) ? "text-primary" : "text-muted-foreground"}`}
          >
            {item.isCenter ? (
              <div className="relative -top-3">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-teal-light flex items-center justify-center shadow-lg shadow-primary/30">
                  <item.icon className="h-6 w-6 text-primary-foreground" />
                </div>
              </div>
            ) : (
              <>
                <item.icon
                  className={`h-5 w-5 ${
                    isActive(item.path) ? "text-primary" : ""
                  }`}
                />
                <span className="text-[10px] mt-1 font-medium">{item.label}</span>
              </>
            )}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default MobileNav;
