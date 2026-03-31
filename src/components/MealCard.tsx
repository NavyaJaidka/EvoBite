import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Meal } from "@/types/diet";
import { ChevronDown, RefreshCw, ExternalLink, Flame, Drumstick, Wheat, Droplet, Check } from "lucide-react";

interface MealCardProps {
  meal: Meal;
  onSwap: () => void;
  isCompleted: boolean;
  onToggleComplete: () => void;
}

const MEAL_ICONS: Record<string, string> = {
  breakfast: "🌅",
  lunch: "☀️",
  dinner: "🌙",
  snack: "⚡",
};

export const MealCard = ({ meal, onSwap, isCompleted, onToggleComplete }: MealCardProps) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      className={`glass-card overflow-hidden hover-lift transition-all ${isCompleted ? "border-primary/30 bg-primary/5" : ""}`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Checkmark */}
            <button
              onClick={onToggleComplete}
              className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                isCompleted ? "gradient-primary border-transparent" : "border-border hover:border-primary/50"
              }`}
            >
              {isCompleted && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
            </button>
            <span className="text-2xl flex-shrink-0">{MEAL_ICONS[meal.type]}</span>
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-wider text-primary font-semibold">{meal.type}</div>
              <h4 className={`font-semibold text-sm truncate ${isCompleted ? "line-through text-muted-foreground" : ""}`}>{meal.name}</h4>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button onClick={onSwap} className="p-1.5 rounded-lg hover:bg-secondary transition" title="Swap meal">
              <RefreshCw className="w-3.5 h-3.5 text-muted-foreground" />
            </button>
            <button onClick={() => setExpanded(!expanded)} className="p-1.5 rounded-lg hover:bg-secondary transition">
              <ChevronDown className={`w-3.5 h-3.5 text-muted-foreground transition-transform ${expanded ? "rotate-180" : ""}`} />
            </button>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-1.5 line-clamp-1">{meal.description}</p>

        {/* Macros */}
        <div className="flex items-center gap-3 mt-3 text-[11px]">
          <span className="flex items-center gap-1 text-neon-green"><Flame className="w-3 h-3" />{meal.calories} cal</span>
          <span className="flex items-center gap-1 text-neon-cyan"><Drumstick className="w-3 h-3" />{meal.protein}g</span>
          <span className="flex items-center gap-1 text-neon-purple"><Wheat className="w-3 h-3" />{meal.carbs}g</span>
          <span className="flex items-center gap-1 text-neon-pink"><Droplet className="w-3 h-3" />{meal.fats}g</span>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 border-t border-border pt-3 space-y-3">
              {meal.isVegan && (
                <span className="inline-block text-[10px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">🌱 Vegan</span>
              )}
              <div>
                <h5 className="text-xs font-semibold text-primary mb-1">Ingredients</h5>
                <ul className="text-xs text-muted-foreground space-y-0.5">
                  {meal.ingredients.map((ing, i) => (
                    <li key={i}>• {ing}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h5 className="text-xs font-semibold text-primary mb-1">Steps</h5>
                <ol className="text-xs text-muted-foreground space-y-0.5">
                  {meal.steps.map((s, i) => (
                    <li key={i}>{i + 1}. {s}</li>
                  ))}
                </ol>
              </div>
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(meal.name + " recipe")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
              >
                View Full Recipe <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
