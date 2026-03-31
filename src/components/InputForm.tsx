import { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { UserProfile } from "@/types/diet";
import { ChevronRight, ChevronLeft, Sparkles, User, Activity, Target, Utensils, Calendar, Zap } from "lucide-react";
import { FloatingParticles } from "./FloatingParticles";

interface InputFormProps {
  onSubmit: (profile: UserProfile) => void;
  onSurprise: () => void;
}

const STEPS = ["Body Metrics", "Lifestyle", "Goal", "Preferences", "Duration"];
const STEP_ICONS = [User, Activity, Target, Utensils, Calendar];

const defaultProfile: UserProfile = {
  age: 0,
  height: 0,
  weight: 0,
  gender: "male",
  activityLevel: "moderate",
  goal: "maintenance",
  duration: 7,
  dietType: "both",
};

export const InputForm = ({ onSubmit, onSurprise }: InputFormProps) => {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [useCustom, setUseCustom] = useState(false);

  const update = (key: keyof UserProfile, value: UserProfile[keyof UserProfile]) =>
    setProfile((p) => ({ ...p, [key]: value }));



  const handleSubmit = () => onSubmit(profile);

  const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? 120 : -120, opacity: 0, scale: 0.9, rotateY: direction > 0 ? 15 : -15 }),
    center: { x: 0, opacity: 1, scale: 1, rotateY: 0 },
    exit: (direction: number) => ({ x: direction > 0 ? -120 : 120, opacity: 0, scale: 0.9, rotateY: direction > 0 ? -15 : 15 }),
  };

  const [direction, setDirection] = useState(1);
  const [prevStep, setPrevStep] = useState(0);

  const goNext = () => { if (step < 4) { setDirection(1); setPrevStep(step); setStep(step + 1); } };
  const goPrev = () => { if (step > 0) { setDirection(-1); setPrevStep(step); setStep(step - 1); } };

  // Stagger animation for children
  const container = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
  };
  const item = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 300, damping: 24 } },
  };

  // 3D tilt effect on the card
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-150, 150], [3, -3]), { stiffness: 200, damping: 30 });
  const rotateY2 = useSpring(useTransform(mouseX, [-200, 200], [-3, 3]), { stiffness: 200, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };
  const handleMouseLeave = () => { mouseX.set(0); mouseY.set(0); };

  // Step-specific accent colors for visual feedback
  const stepAccents = ["from-blue-500 to-cyan-400", "from-green-400 to-emerald-500", "from-orange-400 to-red-500", "from-violet-500 to-purple-500", "from-pink-500 to-rose-400"];

  const OptionButton = ({ active, onClick, children, index = 0 }: { active: boolean; onClick: () => void; children: React.ReactNode; index?: number }) => (
    <motion.button
      variants={item}
      onClick={onClick}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      className={`px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 text-left ${
        active
          ? "border-primary bg-primary/10 text-primary neon-glow"
          : "border-border bg-card text-foreground hover:border-primary/40"
      }`}
    >
      {children}
    </motion.button>
  );

  return (
    <section className="min-h-screen relative flex items-center justify-center px-4 py-20" style={{ perspective: "1200px" }}>
      <FloatingParticles count={14} opacity={0.08} />
      <div className="w-full max-w-lg">
        {/* Animated Progress Bar */}
        <div className="relative flex items-center justify-between mb-8">
          {/* Connecting line */}
          <div className="absolute top-5 left-5 right-5 h-0.5 bg-border">
            <motion.div
              className="h-full gradient-primary rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${(step / 4) * 100}%` }}
              transition={{ type: "spring" as const, stiffness: 200, damping: 25 }}
            />
          </div>
          {STEPS.map((s, i) => {
            const Icon = STEP_ICONS[i];
            return (
              <motion.div
                key={s}
                className="flex flex-col items-center gap-1 relative z-10"
                animate={i === step ? { scale: [1, 1.15, 1] } : { scale: 1 }}
                transition={{ duration: 0.4 }}
              >
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    i <= step
                      ? "gradient-primary border-transparent text-primary-foreground"
                      : "border-border text-muted-foreground bg-background"
                  }`}
                  whileHover={{ scale: 1.1 }}
                  animate={i === step ? { boxShadow: "0 0 20px hsl(var(--primary) / 0.4)" } : { boxShadow: "0 0 0px transparent" }}
                >
                  <Icon className="w-4 h-4" />
                </motion.div>
                <motion.span
                  className="text-[10px] text-muted-foreground hidden sm:block"
                  animate={i === step ? { color: "hsl(var(--primary))", fontWeight: 600 } : {}}
                >
                  {s}
                </motion.span>
              </motion.div>
            );
          })}
        </div>

        {/* 3D Tilting Form Card */}
        <motion.div
          className="glass-card p-8 neon-glow"
          style={{ rotateX, rotateY: rotateY2, transformStyle: "preserve-3d" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {/* Step counter badge */}
          <motion.div
            className="absolute -top-3 right-6 px-3 py-1 rounded-full gradient-primary text-primary-foreground text-xs font-bold"
            key={`badge-${step}`}
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring" as const, stiffness: 400, damping: 15 }}
          >
            {step + 1} / 5
          </motion.div>

          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ type: "spring" as const, stiffness: 300, damping: 30 }}
            >
              {step === 0 && (
                <motion.div className="space-y-6" variants={container} initial="hidden" animate="show">
                  <motion.h2 variants={item} className="text-2xl font-display font-bold flex items-center gap-2">
                    <motion.span animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 3, repeatDelay: 2 }}>📏</motion.span>
                    Body Metrics
                  </motion.h2>
                  <motion.div variants={item} className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">Age</label>
                      <motion.input
                        whileFocus={{ scale: 1.02, borderColor: "hsl(var(--primary))" }}
                        type="number"
                        value={profile.age}
                        onChange={(e) => update("age", +e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground focus:border-primary focus:outline-none transition"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">Weight (kg)</label>
                      <motion.input
                        whileFocus={{ scale: 1.02 }}
                        type="number"
                        value={profile.weight}
                        onChange={(e) => update("weight", +e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground focus:border-primary focus:outline-none transition"
                      />
                    </div>
                  </motion.div>
                  <motion.div variants={item}>
                    <label className="text-sm text-muted-foreground mb-1 block">Height (cm)</label>
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      type="number"
                      value={profile.height}
                      onChange={(e) => update("height", +e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground focus:border-primary focus:outline-none transition"
                    />
                  </motion.div>
                  <motion.div variants={item}>
                    <label className="text-sm text-muted-foreground mb-2 block">Gender</label>
                    <div className="flex gap-3">
                      <OptionButton active={profile.gender === "male"} onClick={() => update("gender", "male")}>👨 Male</OptionButton>
                      <OptionButton active={profile.gender === "female"} onClick={() => update("gender", "female")}>👩 Female</OptionButton>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {step === 1 && (
                <motion.div className="space-y-6" variants={container} initial="hidden" animate="show">
                  <motion.h2 variants={item} className="text-2xl font-display font-bold flex items-center gap-2">
                    <motion.span animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>🏃</motion.span>
                    Lifestyle
                  </motion.h2>
                  <motion.p variants={item} className="text-muted-foreground text-sm">How active are you on a typical day?</motion.p>
                  <motion.div variants={container} className="grid gap-3">
                    {(["sedentary", "light", "moderate", "active", "very_active"] as const).map((level) => (
                      <OptionButton key={level} active={profile.activityLevel === level} onClick={() => update("activityLevel", level)}>
                        {level === "sedentary" && "🪑 Sedentary — Little or no exercise"}
                        {level === "light" && "🚶 Light — 1-3 days/week"}
                        {level === "moderate" && "🏃 Moderate — 3-5 days/week"}
                        {level === "active" && "💪 Active — 6-7 days/week"}
                        {level === "very_active" && "🔥 Very Active — Intense daily"}
                      </OptionButton>
                    ))}
                  </motion.div>
                  <motion.div variants={item}>
                    <label className="text-sm text-muted-foreground mb-2 block">Persona (optional)</label>
                    <div className="flex gap-3 flex-wrap">
                      {(["student", "gym_freak", "office_worker"] as const).map((p) => (
                        <OptionButton key={p} active={profile.persona === p} onClick={() => update("persona", p)}>
                          {p === "student" && "📚 Student"}
                          {p === "gym_freak" && "🏋️ Gym Freak"}
                          {p === "office_worker" && "💼 Office Worker"}
                        </OptionButton>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div className="space-y-6" variants={container} initial="hidden" animate="show">
                  <motion.h2 variants={item} className="text-2xl font-display font-bold flex items-center gap-2">
                    <motion.span animate={{ scale: [1, 1.3, 1] }} transition={{ repeat: Infinity, duration: 2 }}>🎯</motion.span>
                    Your Goal
                  </motion.h2>
                  <motion.div variants={container} className="grid gap-3">
                    {(["fat_loss", "muscle_gain", "maintenance"] as const).map((g) => (
                      <OptionButton key={g} active={profile.goal === g} onClick={() => update("goal", g)}>
                        {g === "fat_loss" && "🔥 Fat Loss — Shed body fat"}
                        {g === "muscle_gain" && "💪 Muscle Gain — Build lean mass"}
                        {g === "maintenance" && "⚖️ Maintenance — Stay balanced"}
                      </OptionButton>
                    ))}
                  </motion.div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div className="space-y-6" variants={container} initial="hidden" animate="show">
                  <motion.h2 variants={item} className="text-2xl font-display font-bold flex items-center gap-2">
                    <motion.span animate={{ rotate: [0, 15, -15, 0] }} transition={{ repeat: Infinity, duration: 2.5 }}>🍽️</motion.span>
                    Preferences
                  </motion.h2>
                  <motion.div variants={item}>
                    <label className="text-sm text-muted-foreground mb-2 block">Diet Type</label>
                    <div className="flex gap-3 flex-wrap">
                      {(["veg", "vegan", "non_veg", "both"] as const).map((d) => (
                        <OptionButton key={d} active={profile.dietType === d} onClick={() => update("dietType", d)}>
                          {d === "veg" && "🥬 Vegetarian"}
                          {d === "vegan" && "🌱 Vegan"}
                          {d === "non_veg" && "🍗 Non-Veg"}
                          {d === "both" && "🍽️ Both"}
                        </OptionButton>
                      ))}
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {step === 4 && (
                <motion.div className="space-y-6" variants={container} initial="hidden" animate="show">
                  <motion.h2 variants={item} className="text-2xl font-display font-bold flex items-center gap-2">
                    <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }}>⏱️</motion.span>
                    Duration & Mode
                  </motion.h2>
                  <motion.div variants={item}>
                    <label className="text-sm text-muted-foreground mb-1 block">Plan Duration (days)</label>
                    <motion.input
                      whileFocus={{ scale: 1.02 }}
                      type="number"
                      value={profile.duration}
                      onChange={(e) => update("duration", Math.max(1, Math.min(30, +e.target.value)))}
                      className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground focus:border-primary focus:outline-none transition"
                      min={1}
                      max={30}
                    />
                  </motion.div>
                  <motion.div variants={item} className="flex items-center gap-3">
                    <button
                      onClick={() => setUseCustom(!useCustom)}
                      className={`w-12 h-6 rounded-full transition-colors relative ${useCustom ? "gradient-primary" : "bg-secondary border border-border"}`}
                    >
                      <motion.div
                        className="w-5 h-5 rounded-full bg-primary-foreground absolute top-0.5"
                        animate={{ left: useCustom ? 24 : 2 }}
                        transition={{ type: "spring" as const, stiffness: 500, damping: 30 }}
                      />
                    </button>
                    <span className="text-sm">Custom Calorie Mode</span>
                  </motion.div>
                  <AnimatePresence>
                    {useCustom && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ type: "spring" as const, stiffness: 300, damping: 25 }}
                      >
                        <label className="text-sm text-muted-foreground mb-1 block">Daily Calorie Target</label>
                        <input
                          type="number"
                          value={profile.customCalories || 2000}
                          onChange={(e) => update("customCalories", +e.target.value)}
                          className="w-full px-4 py-3 rounded-xl bg-secondary border border-border text-foreground focus:border-primary focus:outline-none transition"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <motion.button
                    variants={item}
                    onClick={() => { update("customCalories", undefined); }}
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                    whileHover={{ x: 5 }}
                  >
                    <Sparkles className="w-4 h-4" /> Confused? Let AI decide your calories
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            <motion.button
              onClick={goPrev}
              disabled={step === 0}
              className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 transition"
              whileHover={{ x: -3 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </motion.button>

            {step < 4 ? (
              <motion.button
                onClick={goNext}
                className="flex items-center gap-1 px-6 py-2.5 rounded-xl gradient-primary text-primary-foreground font-medium text-sm transition-transform"
                whileHover={{ scale: 1.05, x: 3 }}
                whileTap={{ scale: 0.95 }}
              >
                Next <ChevronRight className="w-4 h-4" />
              </motion.button>
            ) : (
              <motion.button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl gradient-primary text-primary-foreground font-medium text-sm neon-glow transition-transform"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{ boxShadow: ["0 0 15px hsl(var(--primary) / 0.3)", "0 0 30px hsl(var(--primary) / 0.6)", "0 0 15px hsl(var(--primary) / 0.3)"] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Zap className="w-4 h-4" /> Generate Plan <Sparkles className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        </motion.div>

        {/* Surprise Button */}
        <motion.button
          onClick={onSurprise}
          className="mt-6 w-full py-3 rounded-xl border border-border bg-card text-foreground font-medium hover-lift text-sm"
          whileTap={{ scale: 0.97 }}
          whileHover={{ scale: 1.02 }}
        >
          🎲 Surprise My Diet — Random Healthy Plan
        </motion.button>
      </div>
    </section>
  );
};
