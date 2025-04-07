
import React from "react";
import { cn } from "@/lib/utils";

interface AnimatedLetterProps {
  letter: string;
  index: number;
  className?: string;
}

const AnimatedLetter = ({ letter, index, className }: AnimatedLetterProps) => {
  return (
    <span
      className={cn(
        "inline-block animate-bounce-subtle",
        className
      )}
      style={{
        animationDelay: `${index * 0.1}s`,
      }}
    >
      {letter}
    </span>
  );
};

export default AnimatedLetter;
