import { motion } from "framer-motion";
import { ThemeToggle } from "./ThemeToggle";
import { FloatingParticles } from "./FloatingParticles";
import { Zap } from "lucide-react";

interface HeroProps {
  onGetStarted: () => void;
}

export const Hero = ({ onGetStarted }: HeroProps) => {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-4">
      <FloatingParticles />

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-background/60 border-b border-border/50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Zap className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-display font-bold gradient-text">Evobite</span>
        </div>
        <ThemeToggle />
      </nav>

      {/* Hero Content */}
      <div className="relative z-10 text-center max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/5 mb-8">
            <span className="w-2 h-2 rounded-full gradient-primary animate-pulse" />
            <span className="text-sm font-medium text-primary">AI-Powered Nutrition</span>
          </div>
        </motion.div>

        <motion.h1
          className="text-5xl sm:text-7xl font-display font-bold leading-tight mb-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15 }}
        >
          Eat Smart.{" "}
          <span className="gradient-text">Evolve Daily.</span>
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl text-muted-foreground max-w-xl mx-auto mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Your intelligent diet companion that crafts personalized meal plans, tracks macros, and evolves with your goals.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <button
            onClick={onGetStarted}
            className="group relative px-8 py-4 rounded-2xl gradient-primary text-primary-foreground font-semibold text-lg neon-glow transition-all duration-300 hover:scale-105 active:scale-95"
          >
            <span className="relative z-10 flex items-center gap-2">
              Generate My Plan
              <Zap className="w-5 h-5 group-hover:rotate-12 transition-transform" />
            </span>
          </button>
          <button
            onClick={onGetStarted}
            className="px-8 py-4 rounded-2xl border border-border bg-card text-foreground font-semibold text-lg hover-lift"
          >
            Surprise My Diet 🎲
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="mt-16 grid grid-cols-3 gap-8 max-w-md mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {[
            { value: "50+", label: "Recipes" },
            { value: "Smart", label: "AI Engine" },
            { value: "Free", label: "Forever" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-bold gradient-text">{s.value}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
