import { Briefcase, Building2, Store, Users } from "lucide-react";

type Role = "seeker" | "agent" | "business" | "company";

interface RoleBadgeProps {
  role: Role;
  size?: "sm" | "md";
}

const roleConfig = {
  seeker: {
    label: "Job Seeker",
    icon: Briefcase,
    className: "badge-primary",
  },
  agent: {
    label: "Agent",
    icon: Users,
    className: "badge-warning",
  },
  business: {
    label: "Business",
    icon: Store,
    className: "badge-accent",
  },
  company: {
    label: "Company",
    icon: Building2,
    className: "badge-info",
  },
};

export const RoleBadge = ({ role, size = "md" }: RoleBadgeProps) => {
  const config = roleConfig[role];
  const Icon = config.icon;
  const sizeClass = size === "sm" ? "badge-sm" : "";

  return (
    <span className={`badge ${config.className} ${sizeClass} gap-1`}>
      <Icon className={size === "sm" ? "w-3 h-3" : "w-4 h-4"} />
      {config.label}
    </span>
  );
};

export default RoleBadge;
