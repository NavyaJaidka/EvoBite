import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserProfile } from "@/types/diet";
import { Dumbbell, Heart, Zap, ExternalLink, Check, ChevronDown } from "lucide-react";

interface Exercise {
  name: string;
  sets: string;
  icon: React.ReactNode;
  link: string;
  guidance: string;
  howTo: string[];
}

const FAT_LOSS_EXERCISES: Exercise[] = [
  { name: "Brisk Walking", sets: "30 min", icon: <Heart className="w-4 h-4" />, link: "https://www.youtube.com/results?search_query=brisk+walking+workout", guidance: "Keep pace at 5-6 km/h. Swing arms naturally. Maintain upright posture.",
    howTo: ["Stand tall with shoulders back and core engaged", "Walk at a pace where you can talk but not sing", "Swing arms naturally, bent at 90 degrees", "Land heel first, roll through to toe", "Maintain a steady rhythm for the full 30 minutes"] },
  { name: "Jumping Jacks", sets: "3 × 30 sec", icon: <Zap className="w-4 h-4" />, link: "https://www.youtube.com/results?search_query=jumping+jacks+tutorial", guidance: "Land softly on balls of feet. Keep core tight. Rest 15 sec between sets.",
    howTo: ["Stand with feet together and arms at sides", "Jump feet out wide while raising arms overhead", "Jump feet back together while lowering arms", "Land softly on the balls of your feet each time", "Keep your core tight and maintain a steady pace"] },
  { name: "Mountain Climbers", sets: "3 × 20 reps", icon: <Zap className="w-4 h-4" />, link: "https://www.youtube.com/results?search_query=mountain+climbers+form", guidance: "Keep hips level. Drive knees toward chest. Maintain plank position throughout.",
    howTo: ["Start in a high plank position, hands under shoulders", "Drive your right knee toward your chest", "Quickly switch legs, bringing left knee forward", "Keep hips level — don't let them rise up", "Alternate legs rapidly for the full rep count"] },
  { name: "Cycling / Jogging", sets: "20 min", icon: <Heart className="w-4 h-4" />, link: "https://www.youtube.com/results?search_query=beginner+jogging+plan", guidance: "Start slow, build pace gradually. Aim for 60-70% max heart rate.",
    howTo: ["Start with a 3-minute warm-up walk or easy pedal", "Gradually increase pace over 2 minutes", "Maintain a conversational pace (can speak short sentences)", "If jogging: land midfoot, keep strides short", "Cool down with 2-minute slow walk at the end"] },
  { name: "Burpees", sets: "3 × 10 reps", icon: <Zap className="w-4 h-4" />, link: "https://www.youtube.com/results?search_query=burpees+proper+form", guidance: "Full range of motion. Chest to floor on pushup. Jump explosively.",
    howTo: ["Stand with feet shoulder-width apart", "Drop into a squat, place hands on the floor", "Jump feet back into a plank and do a push-up", "Jump feet forward to hands, return to squat", "Explode upward into a jump, arms overhead"] },
  { name: "High Knees", sets: "3 × 30 sec", icon: <Zap className="w-4 h-4" />, link: "https://www.youtube.com/results?search_query=high+knees+exercise", guidance: "Lift knees to hip height. Pump arms. Stay on balls of feet.",
    howTo: ["Stand tall with feet hip-width apart", "Drive right knee up to hip height", "Quickly switch to the left knee", "Pump arms opposite to legs (like sprinting)", "Stay on the balls of your feet throughout"] },
];

const MUSCLE_EXERCISES: Exercise[] = [
  { name: "Push-ups", sets: "3 × 15 reps", icon: <Dumbbell className="w-4 h-4" />, link: "https://www.youtube.com/results?search_query=perfect+pushup+form", guidance: "Keep body straight. Lower chest to ground. Elbows at 45 degrees.",
    howTo: ["Place hands slightly wider than shoulders", "Keep body in a straight line from head to heels", "Lower chest until it nearly touches the floor", "Keep elbows at about 45° angle from body", "Push back up to full arm extension"] },
  { name: "Squats", sets: "3 × 20 reps", icon: <Dumbbell className="w-4 h-4" />, link: "https://www.youtube.com/results?search_query=bodyweight+squat+form", guidance: "Feet shoulder-width apart. Push hips back. Keep knees over toes.",
    howTo: ["Stand with feet shoulder-width apart, toes slightly out", "Push hips back as if sitting into a chair", "Lower until thighs are parallel to the ground", "Keep chest up and knees tracking over toes", "Drive through heels to stand back up"] },
  { name: "Plank", sets: "3 × 45 sec", icon: <Dumbbell className="w-4 h-4" />, link: "https://www.youtube.com/results?search_query=plank+exercise+form", guidance: "Straight line from head to heels. Engage core. Don't let hips sag.",
    howTo: ["Place forearms on the ground, elbows under shoulders", "Extend legs back, balancing on toes", "Squeeze glutes and brace your core", "Keep a straight line from head to heels", "Hold position, breathing steadily — don't hold breath"] },
  { name: "Lunges", sets: "3 × 12 each", icon: <Dumbbell className="w-4 h-4" />, link: "https://www.youtube.com/results?search_query=lunges+proper+form", guidance: "Step forward, lower back knee to ground. Keep front knee over ankle.",
    howTo: ["Stand tall, take a big step forward with one leg", "Lower your body until both knees are at 90°", "Keep front knee directly over your ankle", "Push through front heel to return to standing", "Alternate legs for each rep"] },
  { name: "Diamond Push-ups", sets: "3 × 10 reps", icon: <Dumbbell className="w-4 h-4" />, link: "https://www.youtube.com/results?search_query=diamond+pushups+tutorial", guidance: "Hands close together forming diamond. Targets triceps more intensely.",
    howTo: ["Place hands close together, thumbs and index fingers touching", "This creates a diamond shape under your chest", "Lower your chest toward your hands", "Keep elbows close to your body", "Push back up — feel the burn in your triceps"] },
  { name: "Glute Bridges", sets: "3 × 15 reps", icon: <Dumbbell className="w-4 h-4" />, link: "https://www.youtube.com/results?search_query=glute+bridge+exercise", guidance: "Squeeze glutes at top. Hold 2 sec. Don't hyperextend lower back.",
    howTo: ["Lie on your back, knees bent, feet flat on floor", "Press through heels and lift hips toward ceiling", "Squeeze glutes hard at the top", "Hold for 2 seconds at peak", "Lower slowly back to the starting position"] },
];

const MAINTENANCE_EXERCISES: Exercise[] = [
  { name: "Walking", sets: "20 min", icon: <Heart className="w-4 h-4" />, link: "https://www.youtube.com/results?search_query=daily+walking+routine", guidance: "Moderate pace. Great for recovery days. Can be done anywhere.",
    howTo: ["Choose a comfortable route (outdoors or treadmill)", "Walk at a moderate pace — slightly brisk", "Keep your posture upright, shoulders relaxed", "Breathe naturally and enjoy the movement", "Aim for about 3,000-4,000 steps in 20 minutes"] },
  { name: "Stretching", sets: "10 min", icon: <Heart className="w-4 h-4" />, link: "https://www.youtube.com/results?search_query=full+body+stretching+routine", guidance: "Hold each stretch 20-30 sec. Don't bounce. Breathe deeply.",
    howTo: ["Start with neck rolls — 5 each direction", "Shoulder stretches: cross arm over chest, hold 20 sec each", "Hamstring stretch: reach for toes, hold 30 sec", "Quad stretch: pull foot to glute, hold 20 sec each", "Finish with a seated spinal twist, 20 sec each side"] },
  { name: "Push-ups", sets: "2 × 10 reps", icon: <Dumbbell className="w-4 h-4" />, link: "https://www.youtube.com/results?search_query=beginner+pushup+routine", guidance: "Modify on knees if needed. Focus on form over speed.",
    howTo: ["Start on knees if full push-ups are too hard", "Place hands shoulder-width apart", "Lower chest slowly to the ground (3 seconds down)", "Push back up with control", "Focus on quality over quantity"] },
  { name: "Yoga Flow", sets: "15 min", icon: <Heart className="w-4 h-4" />, link: "https://www.youtube.com/results?search_query=15+minute+yoga+flow", guidance: "Follow a sun salutation flow. Focus on breath-movement connection.",
    howTo: ["Start in Mountain Pose — stand tall, palms together", "Inhale: reach arms overhead (Upward Salute)", "Exhale: fold forward (Standing Forward Bend)", "Inhale: step back to Downward Dog", "Flow through Cobra → Downward Dog → Forward Bend → Mountain"] },
  { name: "Bodyweight Squats", sets: "2 × 15 reps", icon: <Dumbbell className="w-4 h-4" />, link: "https://www.youtube.com/results?search_query=bodyweight+squat+routine", guidance: "Go at your own pace. Focus on depth and control.",
    howTo: ["Stand with feet shoulder-width apart", "Lower slowly (3 seconds) — control the descent", "Go as deep as comfortable while keeping heels down", "Pause briefly at the bottom", "Stand back up smoothly"] },
  { name: "Dead Hang", sets: "3 × 20 sec", icon: <Dumbbell className="w-4 h-4" />, link: "https://www.youtube.com/results?search_query=dead+hang+exercise", guidance: "Hang from a bar with straight arms. Great for grip and spine decompression.",
    howTo: ["Grab the bar with an overhand grip, hands shoulder-width", "Step off the box or jump up to hang", "Let your body hang with arms fully extended", "Relax your shoulders and breathe deeply", "Hold for 20 seconds, rest, and repeat"] },
];

export const FitnessAddon = ({ goal }: { goal: UserProfile["goal"] }) => {
  const exercises =
    goal === "fat_loss" ? FAT_LOSS_EXERCISES
    : goal === "muscle_gain" ? MUSCLE_EXERCISES
    : MAINTENANCE_EXERCISES;

  const storageKey = `evobite-fitness-${goal}`;
  const [completed, setCompleted] = useState<Set<string>>(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  const [expandedEx, setExpandedEx] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify([...completed]));
  }, [completed, storageKey]);

  const toggleComplete = (name: string) => {
    setCompleted((prev) => {
      const next = new Set(prev);
      if (next.has(name)) next.delete(name);
      else next.add(name);
      return next;
    });
  };

  const completedCount = exercises.filter((e) => completed.has(e.name)).length;
  const progressPct = Math.round((completedCount / exercises.length) * 100);

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-lg font-display font-bold">Daily Fitness Plan</h3>
        <span className="text-sm font-medium text-primary">{completedCount}/{exercises.length} done</span>
      </div>
      <p className="text-xs text-muted-foreground mb-3">
        {goal === "fat_loss" && "Cardio-focused to maximize burn 🔥"}
        {goal === "muscle_gain" && "Strength basics to build lean mass 💪"}
        {goal === "maintenance" && "Light activity to stay balanced ⚖️"}
      </p>

      {/* Progress bar */}
      <div className="w-full h-2 rounded-full bg-secondary mb-5 overflow-hidden">
        <div
          className="h-full rounded-full gradient-primary transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      <div className="grid gap-3">
        {exercises.map((ex, idx) => {
          const isDone = completed.has(ex.name);
          const isExpanded = expandedEx === ex.name;
          return (
            <motion.div
              key={ex.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={`rounded-xl border transition-all duration-200 ${isDone ? "bg-primary/5 border-primary/30" : "bg-secondary/50 border-border"}`}
            >
              <div className="flex items-center gap-3 p-3">
                {/* Checkbox */}
                <button
                  onClick={() => toggleComplete(ex.name)}
                  className={`w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    isDone ? "gradient-primary border-transparent" : "border-border hover:border-primary/50"
                  }`}
                >
                  {isDone && <Check className="w-3.5 h-3.5 text-primary-foreground" />}
                </button>

                {/* Icon */}
                <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center text-primary-foreground flex-shrink-0">
                  {ex.icon}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium ${isDone ? "line-through text-muted-foreground" : ""}`}>{ex.name}</div>
                  <div className="text-[11px] text-muted-foreground">{ex.sets}</div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => setExpandedEx(isExpanded ? null : ex.name)}
                    className={`flex items-center gap-1 px-2.5 py-1 text-[10px] rounded-md border transition font-medium ${
                      isExpanded
                        ? "bg-primary/10 border-primary/30 text-primary"
                        : "bg-secondary border-border hover:border-primary/40 text-muted-foreground"
                    }`}
                  >
                    How to
                    <ChevronDown className={`w-3 h-3 transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                  </button>
                  <a
                    href={ex.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-md hover:bg-secondary transition"
                    title="Watch tutorial"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-primary" />
                  </a>
                </div>
              </div>

              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-3 pb-3">
                      <div className="p-3 rounded-lg bg-secondary/70 border border-border space-y-2">
                        <p className="text-xs font-medium text-foreground">💡 {ex.guidance}</p>
                        <div className="space-y-1.5">
                          <p className="text-[10px] font-semibold text-primary uppercase tracking-wider">Step-by-step</p>
                          {ex.howTo.map((step, i) => (
                            <div key={i} className="flex gap-2 text-xs text-muted-foreground">
                              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold">{i + 1}</span>
                              <span className="pt-0.5">{step}</span>
                            </div>
                          ))}
                        </div>
                        <a
                          href={ex.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-primary hover:underline mt-1"
                        >
                          📺 Watch video tutorial <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>

      {completedCount === exercises.length && (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mt-4 p-3 rounded-xl gradient-primary text-center"
        >
          <span className="text-sm font-semibold text-primary-foreground">🎉 All exercises completed! Great job!</span>
        </motion.div>
      )}
    </div>
  );
};
