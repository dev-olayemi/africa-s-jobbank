import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Search,
  Bell,
  Menu,
  X,
  User,
  Settings,
  LogOut,
  Briefcase,
  Users,
  MessageSquare,
  Home,
  Plus,
  FileText,
  Sparkles,
} from "lucide-react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const canCreateJobs = user?.role === 'agent' || user?.role === 'business' || user?.role === 'company';

  const navLinks = [
    { path: "/dashboard", label: "Dashboard", icon: Home },
    { path: "/jobs", label: "Find Jobs", icon: Briefcase },
    { path: "/network", label: "Network", icon: Users },
    { path: "/messages", label: "Messages", icon: MessageSquare },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass safe-top border-b border-border/50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/dashboard" className="flex-shrink-0">
            <Logo size="md" />
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search jobs, people, hashtags..."
                className="input input-bordered w-full pl-10 h-10 bg-background/50 focus:bg-background transition-all"
              />
            </div>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`btn btn-ghost btn-sm gap-2 ${
                  isActive(link.path) ? "text-primary bg-primary/10" : ""
                }`}
              >
                <link.icon className="h-4 w-4" />
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Create Button */}
            <div className="dropdown dropdown-end">
              <button
                tabIndex={0}
                onClick={() => setIsCreateOpen(!isCreateOpen)}
                className="btn btn-primary btn-sm gap-2"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Create</span>
              </button>
              <ul
                tabIndex={0}
                className="dropdown-content menu menu-sm bg-card rounded-xl shadow-lg w-56 p-2 mt-2 border border-border"
              >
                <li className="menu-title px-2 py-1">
                  <span className="text-foreground font-semibold flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Create New
                  </span>
                </li>
                <div className="divider my-1"></div>
                <li>
                  <Link to="/create/post" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <div>
                      <p className="font-medium">Post Update</p>
                      <p className="text-xs text-muted-foreground">Share with your network</p>
                    </div>
                  </Link>
                </li>
                {canCreateJobs && (
                  <li>
                    <Link to="/create/job" className="flex items-center gap-2">
                      <Briefcase className="h-4 w-4" />
                      <div>
                        <p className="font-medium">Job Posting</p>
                        <p className="text-xs text-muted-foreground">Hire talented professionals</p>
                      </div>
                    </Link>
                  </li>
                )}
              </ul>
            </div>

            <ThemeToggle />

            {/* Notifications */}
            <Link to="/notifications" className="btn btn-ghost btn-circle btn-sm relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 h-4 w-4 bg-accent text-[10px] font-bold rounded-full flex items-center justify-center text-white">
                3
              </span>
            </Link>

            {/* Profile Dropdown */}
            <div className="dropdown dropdown-end">
              <button
                tabIndex={0}
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="btn btn-ghost btn-circle avatar"
              >
                <div className="w-9 h-9 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-background overflow-hidden">
                  <img
                    src={user?.profilePhoto || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.fullName || 'User')}&background=0d9488&color=fff&size=128`}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
              </button>
              <ul
                tabIndex={0}
                className="dropdown-content menu menu-sm bg-card rounded-xl shadow-lg w-56 p-2 mt-2 border border-border"
              >
                <li className="menu-title px-2 py-1">
                  <div className="flex flex-col">
                    <span className="text-foreground font-semibold truncate">{user?.fullName || 'User'}</span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {user?.role === 'seeker' && 'Job Seeker'}
                      {user?.role === 'agent' && 'Recruitment Agent'}
                      {user?.role === 'business' && 'Business Owner'}
                      {user?.role === 'company' && 'Company'}
                    </span>
                  </div>
                </li>
                <div className="divider my-1"></div>
                <li>
                  <Link to="/profile" className="flex items-center gap-2">
                    <User className="h-4 w-4" /> My Profile
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="flex items-center gap-2">
                    <Home className="h-4 w-4" /> Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/settings" className="flex items-center gap-2">
                    <Settings className="h-4 w-4" /> Settings
                  </Link>
                </li>
                <div className="divider my-1"></div>
                <li>
                  <button 
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-error hover:bg-error/10"
                  >
                    <LogOut className="h-4 w-4" /> Logout
                  </button>
                </li>
              </ul>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="btn btn-ghost btn-circle md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search jobs, people..."
              className="input input-bordered w-full pl-10 h-10 bg-background/50"
            />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-card border-t border-border animate-slide-in-bottom">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMenuOpen(false)}
                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                  isActive(link.path)
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted"
                }`}
              >
                <link.icon className="h-5 w-5" />
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
