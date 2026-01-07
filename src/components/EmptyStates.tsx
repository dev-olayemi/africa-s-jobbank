import { Briefcase, Users, Bell, MessageSquare, Search } from "lucide-react";

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}

export const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => (
  <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
    <div className="w-16 h-16 rounded-full bg-base-200 flex items-center justify-center mb-4">
      {icon}
    </div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-base-content/60 max-w-sm mb-4">{description}</p>
    {action}
  </div>
);

export const NoJobsFound = () => (
  <EmptyState
    icon={<Briefcase className="w-8 h-8 text-primary" />}
    title="No jobs found"
    description="Try adjusting your filters or search terms to find more opportunities."
  />
);

export const NoApplications = () => (
  <EmptyState
    icon={<Briefcase className="w-8 h-8 text-primary" />}
    title="No applications yet"
    description="Start browsing jobs and apply to opportunities that match your skills."
  />
);

export const NoConnections = () => (
  <EmptyState
    icon={<Users className="w-8 h-8 text-primary" />}
    title="No connections yet"
    description="Follow people to grow your network and discover opportunities."
  />
);

export const NoNotifications = () => (
  <EmptyState
    icon={<Bell className="w-8 h-8 text-primary" />}
    title="No notifications"
    description="You're all caught up! New notifications will appear here."
  />
);

export const NoMessages = () => (
  <EmptyState
    icon={<MessageSquare className="w-8 h-8 text-primary" />}
    title="No messages yet"
    description="Start a conversation with employers or connections."
  />
);

export const NoSearchResults = () => (
  <EmptyState
    icon={<Search className="w-8 h-8 text-primary" />}
    title="No results found"
    description="Try different keywords or broaden your search."
  />
);
