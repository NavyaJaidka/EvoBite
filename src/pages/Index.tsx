import { useState } from "react";
import { Hero } from "@/components/Hero";
import { InputForm } from "@/components/InputForm";
import { Dashboard } from "@/components/Dashboard";
import { UserProfile, DietPlan } from "@/types/diet";
import { generateDietPlan } from "@/lib/dietEngine";
import { AnimatePresence, motion } from "framer-motion";

type View = "hero" | "form" | "dashboard";

const Index = () => {
  const [view, setView] = useState<View>("hero");
  const [plan, setPlan] = useState<DietPlan | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const handleGenerate = (p: UserProfile) => {
    setProfile(p);
    const generated = generateDietPlan(p);
    setPlan(generated);
    setView("dashboard");
  };

  const handleSurprise = () => {
    const randomProfile: UserProfile = {
      age: 0,
      height: 0,
      weight: 0,
      gender: Math.random() > 0.5 ? "male" : "female",
      activityLevel: "moderate",
      goal: (["fat_loss", "muscle_gain", "maintenance"] as const)[Math.floor(Math.random() * 3)],
      duration: 7,
      dietType: "both",
    };
    handleGenerate(randomProfile);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AnimatePresence mode="wait">
        {view === "hero" && (
          <motion.div key="hero" exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            <Hero onGetStarted={() => setView("form")} />
          </motion.div>
        )}
        {view === "form" && (
          <motion.div key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
            <InputForm onSubmit={handleGenerate} onSurprise={handleSurprise} />
          </motion.div>
        )}
        {view === "dashboard" && plan && profile && (
          <motion.div key="dashboard" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <Dashboard plan={plan} profile={profile} onBack={() => setView("form")} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Index;
