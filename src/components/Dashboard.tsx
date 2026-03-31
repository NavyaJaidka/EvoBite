import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { DietPlan, UserProfile } from "@/types/diet";
import { swapMeal } from "@/lib/dietEngine";
import { AnimatedCounter } from "./AnimatedCounter";
import { MacroRing } from "./MacroRing";
import { MealCard } from "./MealCard";
import { FitnessAddon } from "./FitnessAddon";
import { ThemeToggle } from "./ThemeToggle";
import { ArrowLeft, Download, Zap, Trophy } from "lucide-react";
import { FloatingParticles } from "./FloatingParticles";
import { downloadDietPDF } from "@/lib/pdfExport";

interface DashboardProps {
  plan: DietPlan;
  profile: UserProfile;
  onBack: () => void;
}

export const Dashboard = ({ plan, profile, onBack }: DashboardProps) => {
  const [days, setDays] = useState(plan.days);
  const [selectedDay, setSelectedDay] = useState(0);
  const [completedMeals, setCompletedMeals] = useState<Set<string>>(() => {
    const saved = localStorage.getItem("evobite-completed-meals");
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  useEffect(() => {
    localStorage.setItem("evobite-completed-meals", JSON.stringify([...completedMeals]));
  }, [completedMeals]);

  const toggleMealComplete = (key: string) => {
    setCompletedMeals((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const currentDay = days[selectedDay];

  const handleSwap = (dayIndex: number, mealIndex: number) => {
    const newDay = swapMeal(days[dayIndex], mealIndex, plan.dailyCalories, profile.dietType);
    const newDays = [...days];
    newDays[dayIndex] = { ...newDay, day: days[dayIndex].day };
    setDays(newDays);
  };

  const handleDownload = () => {
    downloadDietPDF(plan, days, profile);
  };

  return (
    <div className="min-h-screen relative">
      <FloatingParticles count={12} opacity={0.06} />
      {/* Nav */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-background/60 border-b border-border/50">
        <button onClick={onBack} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg gradient-primary flex items-center justify-center">
            <Zap className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-display font-bold gradient-text">Evobite</span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleDownload} className="p-2 rounded-lg hover:bg-secondary transition" title="Download Plan">
            <Download className="w-4 h-4" />
          </button>
          <ThemeToggle />
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Summary Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <div className="glass-card p-5 text-center neon-glow">
            <div className="text-3xl font-bold gradient-text">
              <AnimatedCounter value={plan.dailyCalories} />
            </div>
            <div className="text-xs text-muted-foreground mt-1">Daily Calories</div>
          </div>
          <div className="glass-card p-5 text-center">
            <div className="text-3xl font-bold">{plan.bmr}</div>
            <div className="text-xs text-muted-foreground mt-1">BMR</div>
          </div>
          <div className="glass-card p-5 text-center">
            <div className="text-3xl font-bold">{plan.tdee}</div>
            <div className="text-xs text-muted-foreground mt-1">TDEE</div>
          </div>
          <div className="glass-card p-5 text-center">
            <div className="flex items-center justify-center gap-1">
              <Trophy className="w-5 h-5 text-primary" />
              <span className="text-3xl font-bold gradient-text">{plan.dietScore}</span>
            </div>
            <div className="text-xs text-muted-foreground mt-1">Diet Score</div>
          </div>
        </motion.div>

        {/* Macro Rings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="glass-card p-6"
        >
          <h3 className="text-lg font-display font-bold mb-4">Macro Split</h3>
          <div className="flex items-center justify-around">
            <MacroRing label="Protein" value={plan.proteinGrams} max={300} color="hsl(var(--neon-cyan))" />
            <MacroRing label="Carbs" value={plan.carbsGrams} max={400} color="hsl(var(--neon-purple))" />
            <MacroRing label="Fats" value={plan.fatsGrams} max={150} color="hsl(var(--neon-pink))" />
          </div>
        </motion.div>

        {/* Day Selector */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
        >
          <h3 className="text-lg font-display font-bold mb-3">Your Plan</h3>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {days.map((d, i) => (
              <button
                key={d.day}
                onClick={() => setSelectedDay(i)}
                className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  selectedDay === i
                    ? "gradient-primary text-primary-foreground neon-glow"
                    : "bg-secondary border border-border text-foreground hover:border-primary/40"
                }`}
              >
                Day {d.day}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Day Meals */}
        <motion.div
          key={selectedDay}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Day {currentDay.day} — {currentDay.totalCalories} kcal
            </span>
            <span className={`text-xs font-medium px-2 py-1 rounded-lg ${
              Math.abs(currentDay.totalCalories - plan.dailyCalories) < 100
                ? "bg-primary/10 text-primary"
                : "bg-destructive/10 text-destructive"
            }`}>
              {currentDay.totalCalories - plan.dailyCalories > 0 ? "+" : ""}
              {currentDay.totalCalories - plan.dailyCalories} from target
            </span>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {currentDay.meals.map((meal, mealIdx) => {
              const mealKey = `day${currentDay.day}-${mealIdx}`;
              return (
                <MealCard
                  key={`${selectedDay}-${mealIdx}-${meal.name}`}
                  meal={meal}
                  onSwap={() => handleSwap(selectedDay, mealIdx)}
                  isCompleted={completedMeals.has(mealKey)}
                  onToggleComplete={() => toggleMealComplete(mealKey)}
                />
              );
            })}
          </div>
        </motion.div>

        {/* Fitness Addon */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
        >
          <FitnessAddon goal={profile.goal} />
        </motion.div>
      </div>
    </div>
  );
};
