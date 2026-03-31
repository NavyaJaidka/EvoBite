import { UserProfile, DietPlan, DayPlan, Meal } from "@/types/diet";
import { mealDatabase } from "@/data/meals";

const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

const GOAL_ADJUSTMENTS = {
  fat_loss: -500,
  muscle_gain: 300,
  maintenance: 0,
};

export function calculateBMR(profile: UserProfile): number {
  const { weight, height, age, gender } = profile;
  if (gender === "male") {
    return 10 * weight + 6.25 * height - 5 * age + 5;
  }
  return 10 * weight + 6.25 * height - 5 * age - 161;
}

export function calculateTDEE(bmr: number, activityLevel: UserProfile["activityLevel"]): number {
  return Math.round(bmr * ACTIVITY_MULTIPLIERS[activityLevel]);
}

export function calculateDailyCalories(profile: UserProfile): number {
  if (profile.customCalories) return profile.customCalories;
  const bmr = calculateBMR(profile);
  const tdee = calculateTDEE(bmr, profile.activityLevel);
  return Math.round(tdee + GOAL_ADJUSTMENTS[profile.goal]);
}

function pickMeal(meals: Meal[], targetCalories: number, dietType: string, used: Set<string>): Meal {
  const filtered = meals.filter((m) => {
    if (used.has(m.name)) return false;
    if (dietType === "vegan" && !m.isVegan) return false;
    if (dietType === "veg" && !m.isVeg) return false;
    if (dietType === "non_veg" && m.isVeg) return false;
    return true;
  });
  
  const candidates = filtered.length > 0 ? filtered : meals.filter(m => !used.has(m.name));
  if (candidates.length === 0) return meals[Math.floor(Math.random() * meals.length)];
  
  candidates.sort((a, b) => Math.abs(a.calories - targetCalories) - Math.abs(b.calories - targetCalories));
  // Pick from top 3 closest matches randomly
  const top = candidates.slice(0, Math.min(3, candidates.length));
  return top[Math.floor(Math.random() * top.length)];
}

export function generateDayPlan(dailyCalories: number, dietType: string, usedNames: Set<string>): DayPlan {
  // Distribute: breakfast 25%, lunch 35%, dinner 30%, snack 10%
  const bfTarget = dailyCalories * 0.25;
  const lunchTarget = dailyCalories * 0.35;
  const dinnerTarget = dailyCalories * 0.30;
  const snackTarget = dailyCalories * 0.10;

  const breakfast = pickMeal(mealDatabase.breakfasts, bfTarget, dietType, usedNames);
  usedNames.add(breakfast.name);
  const lunch = pickMeal(mealDatabase.lunches, lunchTarget, dietType, usedNames);
  usedNames.add(lunch.name);
  const dinner = pickMeal(mealDatabase.dinners, dinnerTarget, dietType, usedNames);
  usedNames.add(dinner.name);
  const snack = pickMeal(mealDatabase.snacks, snackTarget, dietType, usedNames);
  usedNames.add(snack.name);

  const meals = [breakfast, lunch, dinner, snack];
  return {
    day: 0,
    meals,
    totalCalories: meals.reduce((s, m) => s + m.calories, 0),
    totalProtein: meals.reduce((s, m) => s + m.protein, 0),
    totalCarbs: meals.reduce((s, m) => s + m.carbs, 0),
    totalFats: meals.reduce((s, m) => s + m.fats, 0),
  };
}

export function generateDietPlan(profile: UserProfile): DietPlan {
  const bmr = calculateBMR(profile);
  const tdee = calculateTDEE(bmr, profile.activityLevel);
  const dailyCalories = calculateDailyCalories(profile);

  // Macro split based on goal
  let proteinPct = 0.3, carbsPct = 0.4, fatsPct = 0.3;
  if (profile.goal === "muscle_gain") { proteinPct = 0.35; carbsPct = 0.40; fatsPct = 0.25; }
  if (profile.goal === "fat_loss") { proteinPct = 0.35; carbsPct = 0.35; fatsPct = 0.30; }

  const proteinGrams = Math.round((dailyCalories * proteinPct) / 4);
  const carbsGrams = Math.round((dailyCalories * carbsPct) / 4);
  const fatsGrams = Math.round((dailyCalories * fatsPct) / 9);

  const days: DayPlan[] = [];
  const usedNames = new Set<string>();
  
  for (let i = 0; i < profile.duration; i++) {
    if (i % 3 === 0) usedNames.clear(); // reset every 3 days for variety
    const day = generateDayPlan(dailyCalories, profile.dietType, usedNames);
    day.day = i + 1;
    days.push(day);
  }

  // Calculate diet score
  const avgCalDiff = days.reduce((s, d) => s + Math.abs(d.totalCalories - dailyCalories), 0) / days.length;
  const dietScore = Math.max(70, Math.min(99, Math.round(100 - avgCalDiff / 10)));

  return { dailyCalories, bmr: Math.round(bmr), tdee, proteinGrams, carbsGrams, fatsGrams, days, dietScore };
}

export function swapMeal(dayPlan: DayPlan, mealIndex: number, dailyCalories: number, dietType: string): DayPlan {
  const meal = dayPlan.meals[mealIndex];
  const mealType = meal.type;
  const db = mealType === "breakfast" ? mealDatabase.breakfasts
    : mealType === "lunch" ? mealDatabase.lunches
    : mealType === "dinner" ? mealDatabase.dinners
    : mealDatabase.snacks;
  
  const usedNames = new Set(dayPlan.meals.map(m => m.name));
  const targetCal = mealType === "breakfast" ? dailyCalories * 0.25
    : mealType === "lunch" ? dailyCalories * 0.35
    : mealType === "dinner" ? dailyCalories * 0.30
    : dailyCalories * 0.10;
  
  const newMeal = pickMeal(db, targetCal, dietType, usedNames);
  const newMeals = [...dayPlan.meals];
  newMeals[mealIndex] = newMeal;

  return {
    ...dayPlan,
    meals: newMeals,
    totalCalories: newMeals.reduce((s, m) => s + m.calories, 0),
    totalProtein: newMeals.reduce((s, m) => s + m.protein, 0),
    totalCarbs: newMeals.reduce((s, m) => s + m.carbs, 0),
    totalFats: newMeals.reduce((s, m) => s + m.fats, 0),
  };
}
