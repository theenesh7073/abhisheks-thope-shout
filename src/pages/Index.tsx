
import React, { useEffect, useState } from "react";
import Title from "@/components/Title";
import StarBurst from "@/components/StarBurst";
import { toast } from "sonner";

const celebratoryMessages = [
  "Absolutely Thope!",
  "Totally Awesome!",
  "Simply Amazing!",
  "Incredibly Thope!",
  "Beyond Awesome!"
];

const Index = () => {
  const [clicked, setClicked] = useState(0);
  
  useEffect(() => {
    // Show a welcome toast when the page loads
    setTimeout(() => {
      toast("Welcome to Abhishek's celebration page!", {
        description: "Click anywhere to celebrate more!",
        duration: 5000,
      });
    }, 1000);
  }, []);

  const handleClick = () => {
    // Increment click counter
    setClicked(prev => prev + 1);
    
    // Show a celebratory toast
    const randomMessage = celebratoryMessages[Math.floor(Math.random() * celebratoryMessages.length)];
    toast(randomMessage, {
      description: `Abhishek is Thope x${clicked + 1}`,
    });
  };

  return (
    <div 
      className="min-h-screen thope-bg-gradient flex flex-col items-center justify-center relative overflow-hidden p-4"
      onClick={handleClick}
    >
      {/* Decorative elements */}
      <StarBurst className="top-10 left-10" size="md" color="#8B5CF6" />
      <StarBurst className="bottom-20 right-10" size="lg" color="#F97316" />
      <StarBurst className="top-1/2 right-1/4" size="sm" color="#D946EF" />
      <StarBurst className="bottom-10 left-1/4" size="md" color="#D6BCFA" />
      
      <div className="thope-card rounded-2xl p-8 md:p-12 shadow-lg max-w-3xl w-full relative z-10">
        <div className="text-center">
          <Title text="Abhishek is" className="mb-2" />
          <Title text="Thope" highlight="Thope" className="mb-8 text-5xl md:text-7xl lg:text-9xl" />
          
          <p className="mt-6 text-lg md:text-xl opacity-75 animate-gradient-flow">
            Click anywhere to celebrate more!
          </p>
          
          {clicked > 0 && (
            <div className="mt-8">
              <div className="text-thope-dark font-medium text-lg">
                Celebration count: <span className="text-thope-accent font-bold">{clicked}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <footer className="absolute bottom-4 text-sm text-gray-500">
        &copy; {new Date().getFullYear()} Abhishek is Thope
      </footer>
    </div>
  );
};

export default Index;
