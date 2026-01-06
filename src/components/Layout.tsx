import { ReactNode } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import MobileNav from "./MobileNav";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  
  // Pages that don't need the full layout
  const authPages = ["/login", "/signup", "/verify", "/"];
  const isAuthPage = authPages.includes(location.pathname);

  if (isAuthPage && location.pathname !== "/") {
    return <>{children}</>;
  }

  // Landing page has its own navbar
  if (location.pathname === "/") {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 md:pt-20 pb-20 md:pb-8">
        {children}
      </main>
      <MobileNav />
    </div>
  );
};

export default Layout;
