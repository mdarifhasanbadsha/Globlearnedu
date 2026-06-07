import Link from "next/link";
import { cn } from "@/lib/utils";

interface ButtonProps {
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "whatsapp";
  size?: "sm" | "md" | "lg";
  className?: string;
  children: React.ReactNode;
  fullWidth?: boolean;
  external?: boolean;
}

export default function Button({
  href,
  onClick,
  variant = "primary",
  size = "md",
  className,
  children,
  fullWidth,
  external,
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 cursor-pointer border-0";
  const variants = {
    primary: "bg-[#C8102E] text-white hover:bg-[#A50D25] shadow-sm",
    secondary: "bg-[#1B3A6B] text-white hover:bg-[#152d56]",
    ghost: "bg-transparent text-white border-2 border-white hover:bg-white hover:text-[#1B3A6B]",
    whatsapp: "bg-[#25D366] text-white hover:bg-[#1ea952]",
  };
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-sm",
    lg: "px-8 py-4 text-base",
  };
  const classes = cn(
    base,
    variants[variant],
    sizes[size],
    fullWidth && "w-full",
    className
  );

  if (href) {
    return external ? (
      <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {children}
      </a>
    ) : (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  return (
    <button onClick={onClick} className={classes}>
      {children}
    </button>
  );
}
