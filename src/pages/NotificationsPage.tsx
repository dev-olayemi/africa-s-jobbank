import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import {
  Briefcase,
  Heart,
  MessageSquare,
  UserPlus,
  Bell,
  CheckCheck,
} from "lucide-react";

const mockNotifications = [
  {
    id: "1",
    type: "job_alert",
    title: "New job matches your profile",
    message: "Sales Representative at TechMart Nigeria",
    time: "2 hours ago",
    read: false,
    link: "/jobs/1",
  },
  {
    id: "2",
    type: "like",
    title: "Emeka Johnson liked your post",
    message: "Your update about customer service certification",
    time: "5 hours ago",
    read: false,
    link: "/profile",
  },
  {
    id: "3",
    type: "comment",
    title: "Fatima Ibrahim commented",
    message: '"Congratulations! Well deserved."',
    time: "1 day ago",
    read: true,
    link: "/profile",
  },
  {
    id: "4",
    type: "follow",
    title: "TechMart Nigeria started following you",
    message: "A verified employer is interested in your profile",
    time: "2 days ago",
    read: true,
    link: "/profile/3",
  },
  {
    id: "5",
    type: "application",
    title: "Application update",
    message: "Your application for Store Manager was viewed",
    time: "3 days ago",
    read: true,
    link: "/applications",
  },
];

const typeConfig = {
  job_alert: { icon: Briefcase, color: "text-primary" },
  like: { icon: Heart, color: "text-destructive" },
  comment: { icon: MessageSquare, color: "text-info" },
  follow: { icon: UserPlus, color: "text-success" },
  application: { icon: Bell, color: "text-warning" },
};

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const filteredNotifications = notifications.filter((n) =>
    filter === "all" ? true : filter === "unread" ? !n.read : n.type === filter
  );

  return (
    <Layout>
      <div className="max-w-2xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Notifications</h1>
            {unreadCount > 0 && (
              <p className="text-sm text-muted-foreground">{unreadCount} unread</p>
            )}
          </div>
          {unreadCount > 0 && (
            <button onClick={markAllAsRead} className="btn btn-ghost btn-sm gap-1">
              <CheckCheck className="w-4 h-4" />
              Mark all read
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4">
          {["all", "unread", "job_alert", "like", "follow"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`btn btn-sm ${filter === f ? "btn-primary" : "btn-ghost"}`}
            >
              {f === "all" ? "All" : f === "unread" ? "Unread" : f === "job_alert" ? "Jobs" : f === "like" ? "Likes" : "Follows"}
            </button>
          ))}
        </div>

        {/* List */}
        {filteredNotifications.length > 0 ? (
          <div className="space-y-2">
            {filteredNotifications.map((notification) => {
              const config = typeConfig[notification.type as keyof typeof typeConfig];
              const Icon = config.icon;

              return (
                <Link
                  key={notification.id}
                  to={notification.link}
                  className={`flex gap-3 p-4 rounded-xl transition-colors ${
                    notification.read ? "bg-card" : "bg-primary/5"
                  } hover:bg-muted border border-border`}
                >
                  <div className={`w-10 h-10 rounded-full bg-muted flex items-center justify-center shrink-0 ${config.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm text-foreground ${notification.read ? "" : "font-medium"}`}>
                      {notification.title}
                    </p>
                    <p className="text-sm text-muted-foreground line-clamp-1">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" />
                  )}
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="bg-card rounded-xl border border-border p-12 text-center">
            <Bell className="h-16 w-16 text-muted-foreground/30 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No notifications</h3>
            <p className="text-muted-foreground">You're all caught up!</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default NotificationsPage;