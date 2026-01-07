import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { useTheme } from "@/components/ThemeProvider";
import {
  User,
  Bell,
  Shield,
  CreditCard,
  Moon,
  Sun,
  ChevronRight,
  LogOut,
  Trash2,
} from "lucide-react";

const SettingsPage = () => {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = useState({
    jobAlerts: true,
    messages: true,
    marketing: false,
  });

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        {/* Account Section */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-base-content/60 uppercase tracking-wide mb-3">Account</h2>
          <div className="bg-base-100 rounded-xl shadow-sm divide-y divide-base-200">
            <Link to="/profile/edit" className="flex items-center justify-between p-4 hover:bg-base-200/50 transition-colors">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-primary" />
                <span>Edit Profile</span>
              </div>
              <ChevronRight className="w-5 h-5 text-base-content/40" />
            </Link>
            <Link to="/subscribe" className="flex items-center justify-between p-4 hover:bg-base-200/50 transition-colors">
              <div className="flex items-center gap-3">
                <CreditCard className="w-5 h-5 text-primary" />
                <div>
                  <span>Subscription</span>
                  <p className="text-sm text-base-content/60">Free Trial - 2 days left</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-base-content/40" />
            </Link>
          </div>
        </div>

        {/* Appearance Section */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-base-content/60 uppercase tracking-wide mb-3">Appearance</h2>
          <div className="bg-base-100 rounded-xl shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {theme === "dark" ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-primary" />}
                <span>Theme</span>
              </div>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as "light" | "dark" | "system")}
                className="select select-bordered select-sm"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="mb-6">
          <h2 className="text-sm font-semibold text-base-content/60 uppercase tracking-wide mb-3">Notifications</h2>
          <div className="bg-base-100 rounded-xl shadow-sm divide-y divide-base-200">
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-primary" />
                <div>
                  <span>Job Alerts</span>
                  <p className="text-sm text-base-content/60">Get notified about matching jobs</p>
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
                  <span>Messages</span>
                  <p className="text-sm text-base-content/60">New message notifications</p>
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
                <Bell className="w-5 h-5 text-base-content/40" />
                <div>
                  <span>Marketing</span>
                  <p className="text-sm text-base-content/60">Tips and promotional content</p>
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
          <h2 className="text-sm font-semibold text-base-content/60 uppercase tracking-wide mb-3">Privacy & Security</h2>
          <div className="bg-base-100 rounded-xl shadow-sm divide-y divide-base-200">
            <button className="w-full flex items-center justify-between p-4 hover:bg-base-200/50 transition-colors">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary" />
                <span>Privacy Settings</span>
              </div>
              <ChevronRight className="w-5 h-5 text-base-content/40" />
            </button>
            <button className="w-full flex items-center justify-between p-4 hover:bg-base-200/50 transition-colors">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-primary" />
                <span>Change Password</span>
              </div>
              <ChevronRight className="w-5 h-5 text-base-content/40" />
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div>
          <h2 className="text-sm font-semibold text-base-content/60 uppercase tracking-wide mb-3">Account Actions</h2>
          <div className="bg-base-100 rounded-xl shadow-sm divide-y divide-base-200">
            <button className="w-full flex items-center gap-3 p-4 text-warning hover:bg-base-200/50 transition-colors">
              <LogOut className="w-5 h-5" />
              <span>Log Out</span>
            </button>
            <button className="w-full flex items-center gap-3 p-4 text-error hover:bg-base-200/50 transition-colors">
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
