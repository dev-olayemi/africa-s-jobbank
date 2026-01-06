import logoIcon from "@/assets/logo-icon.png";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  className?: string;
}

const Logo = ({ size = "md", showText = true, className = "" }: LogoProps) => {
  const sizes = {
    sm: { icon: "h-8 w-8", text: "text-lg" },
    md: { icon: "h-10 w-10", text: "text-xl" },
    lg: { icon: "h-14 w-14", text: "text-2xl" },
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <img
        src={logoIcon}
        alt="JobFolio Africa"
        className={`${sizes[size].icon} object-contain`}
      />
      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`font-bold text-foreground ${sizes[size].text}`}>
            Job<span className="text-primary">Folio</span>
          </span>
          <span className="text-[10px] font-medium text-muted-foreground tracking-wider uppercase">
            Africa
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
