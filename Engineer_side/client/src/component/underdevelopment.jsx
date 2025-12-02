import React, { useState, useEffect } from "react";
import { Wrench, Rocket } from "lucide-react";

export default function UnderDevelopment() {
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-200 via-purple-300 to-slate-200 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        <div className="mb-8 flex justify-center">
          <div className="relative">
            <div className="absolute inset-0 bg-purple-500 rounded-full blur-xl opacity-50 animate-pulse"></div>
            <div className="relative bg-slate-800 p-8 rounded-full border-4 border-purple-500 shadow-2xl">
              <Wrench className="w-16 h-16 text-purple-400 animate-bounce" />
            </div>
          </div>
        </div>

        {/* Main Heading */}
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight">
          Under Development
        </h1>

        {/* Subheading with animated dots */}
        <p className="text-xl md:text-2xl text-purple-300 mb-8">
          We're building something awesome{dots}
        </p>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-1 gap-6 mb-12">
          <div className="bg-slate-800/50 backdrop-blur-sm p-6 rounded-lg border border-purple-500/30 hover:border-purple-500 transition-all duration-300 hover:transform hover:scale-105">
            <Rocket className="w-10 h-10 text-purple-400 mx-auto mb-3" />
            <h3 className="text-white font-semibold text-lg mb-2">
              Coming Soon
            </h3>
            <p className="text-gray-400 text-sm">
              Innovative features that will blow your mind
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
