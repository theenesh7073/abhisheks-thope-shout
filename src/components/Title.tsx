
import React from "react";
import AnimatedLetter from "./AnimatedLetter";
import { cn } from "@/lib/utils";

interface TitleProps {
  text: string;
  className?: string;
  highlight?: string;
}

const Title = ({ text, className, highlight }: TitleProps) => {
  const words = text.split(" ");
  
  return (
    <h1 className={cn("text-4xl md:text-6xl lg:text-8xl font-extrabold tracking-tight", className)}>
      {words.map((word, wordIndex) => (
        <React.Fragment key={`word-${wordIndex}`}>
          {wordIndex > 0 && " "}
          {word === highlight ? (
            <span className="thope-gradient-text animate-text-spotlight">
              {word.split("").map((letter, letterIndex) => (
                <AnimatedLetter
                  key={`letter-${letterIndex}`}
                  letter={letter}
                  index={letterIndex}
                  className="text-transparent"
                />
              ))}
            </span>
          ) : (
            word.split("").map((letter, letterIndex) => (
              <AnimatedLetter
                key={`letter-${letterIndex}`}
                letter={letter}
                index={letterIndex + (wordIndex * word.length)}
              />
            ))
          )}
        </React.Fragment>
      ))}
    </h1>
  );
};

export default Title;
