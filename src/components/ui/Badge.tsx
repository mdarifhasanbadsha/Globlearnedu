import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "red" | "gold" | "green" | "blue" | "outline";
  className?: string;
}

export default function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  const variants = {
    default: "bg-[#EEF4FF] text-[#1B3A6B]",
    red: "bg-[#FFF0F2] text-[#C8102E]",
    gold: "bg-[#FFFBEB] text-[#92610A]",
    green: "bg-[#F0FDF4] text-[#166534]",
    blue: "bg-[#E0F2FE] text-[#0369A1]",
    outline: "bg-transparent border border-[#E5E7EB] text-[#6B7280]",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
