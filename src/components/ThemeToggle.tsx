import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { motion } from "framer-motion";

export const ThemeToggle = () => {
  const { isDark, toggle } = useTheme();
  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={toggle}
      className="relative w-14 h-7 rounded-full bg-secondary border border-border flex items-center px-1 transition-colors"
      aria-label="Toggle theme"
    >
      <motion.div
        className="w-5 h-5 rounded-full gradient-primary flex items-center justify-center"
        animate={{ x: isDark ? 24 : 0 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
      >
        {isDark ? <Moon className="w-3 h-3 text-primary-foreground" /> : <Sun className="w-3 h-3 text-primary-foreground" />}
      </motion.div>
    </motion.button>
  );
};
