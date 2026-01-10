import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "@/components/Layout";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/contexts/AuthContext";
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Moon,
  Sun,
  Monitor,
  ChevronRight,
  LogOut,
  Trash2,
} from "lucide-react";

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState({
    jobAlerts: true,
    messages: true,
    marketing: false,
  });

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const themeOptions = [
    { value: "light", label: "Light", icon: Sun },
    { value: "dark", label: "Dark", icon: Moon },
    { value: "system", label: "System", icon: Monitor },
  ] as const;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-foreground mb-6">Settings</h1>

        {/* Account Section */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Account</h2>
          <div className="bg-card rounded-xl border border-border divide-y divide-border">
            <Link to="/profile/edit" className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-primary" />
                <span className="text-foreground">Edit Profile</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Link>
            <Link to="/subscribe" className="flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-primary" />
                <div>
                  <span className="text-foreground">Subscription</span>
                  <p className="text-sm text-muted-foreground">Free Trial - 2 days left</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </Link>
          </div>
        </div>

        {/* Appearance Section */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Appearance</h2>
          <div className="bg-card rounded-xl border border-border p-4">
            <p className="text-sm text-foreground font-medium mb-3">Theme</p>
            <div className="grid grid-cols-3 gap-2">
              {themeOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    onClick={() => setTheme(option.value)}
                    className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all ${
                      theme === option.value
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-border text-muted-foreground hover:border-primary/50"
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="text-sm font-medium">{option.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Notifications</h2>
          <div className="bg-card rounded-xl border border-border divide-y divide-border">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-primary" />
                <div>
                  <span className="text-foreground">Job Alerts</span>
                  <p className="text-sm text-muted-foreground">Get notified about matching jobs</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifications.jobAlerts}
                onChange={(e) => setNotifications({ ...notifications, jobAlerts: e.target.checked })}
                className="toggle toggle-primary"
              />
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-primary" />
                <div>
                  <span className="text-foreground">Messages</span>
                  <p className="text-sm text-muted-foreground">New message notifications</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifications.messages}
                onChange={(e) => setNotifications({ ...notifications, messages: e.target.checked })}
                className="toggle toggle-primary"
              />
            </div>
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <div>
                  <span className="text-foreground">Marketing</span>
                  <p className="text-sm text-muted-foreground">Tips and promotional content</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={notifications.marketing}
                onChange={(e) => setNotifications({ ...notifications, marketing: e.target.checked })}
                className="toggle toggle-primary"
              />
            </div>
          </div>
        </div>

        {/* Privacy Section */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Privacy & Security</h2>
          <div className="bg-card rounded-xl border border-border divide-y divide-border">
            <button className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-foreground">Privacy Settings</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-foreground">Change Password</span>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div>
          <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Account Actions</h2>
          <div className="bg-card rounded-xl border border-border divide-y divide-border">
            <button 
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-4 text-warning hover:bg-muted/50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Log Out</span>
            </button>
            <button className="w-full flex items-center gap-3 p-4 text-destructive hover:bg-muted/50 transition-colors">
              <Trash2 className="w-5 h-5" />
              <span>Delete Account</span>
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;