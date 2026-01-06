import { BadgeCheck, Shield, Building2, Star } from "lucide-react";

interface VerificationBadgeProps {
  type: "verified" | "trusted" | "company" | "premium";
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const VerificationBadge = ({ type, size = "md", showLabel = false }: VerificationBadgeProps) => {
  const config = {
    verified: {
      icon: BadgeCheck,
      label: "Verified",
      className: "badge-verified",
    },
    trusted: {
      icon: Shield,
      label: "Trusted",
      className: "badge-trust",
    },
    company: {
      icon: Building2,
      label: "CAC Verified",
      className: "bg-info/15 text-info",
    },
    premium: {
      icon: Star,
      label: "Premium",
      className: "bg-accent/15 text-accent",
    },
  };

  const { icon: Icon, label, className } = config[type];

  const sizes = {
    sm: "text-[10px] px-1.5 py-0.5",
    md: "text-xs px-2 py-0.5",
    lg: "text-sm px-3 py-1",
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-3.5 w-3.5",
    lg: "h-4 w-4",
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${className} ${sizes[size]}`}>
      <Icon className={iconSizes[size]} />
      {showLabel && label}
    </span>
  );
};

export default VerificationBadge;
