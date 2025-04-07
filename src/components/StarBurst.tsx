
import { cn } from "@/lib/utils";

interface StarBurstProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  color?: string;
}

const StarBurst = ({ className, size = "md", color = "#8B5CF6" }: StarBurstProps) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-16 h-16",
    lg: "w-24 h-24",
  };

  return (
    <div className={cn(
      "absolute opacity-60 z-0 animate-pulse",
      sizeClasses[size],
      className
    )}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 0L55.9 44.1L100 50L55.9 55.9L50 100L44.1 55.9L0 50L44.1 44.1L50 0Z" fill={color} />
      </svg>
    </div>
  );
};

export default StarBurst;
