export interface UserProfile {
  age: number;
  height: number;
  weight: number;
  gender: "male" | "female";
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very_active";
  goal: "fat_loss" | "muscle_gain" | "maintenance";
  duration: number;
  dietType: "veg" | "non_veg" | "vegan" | "both";
  customCalories?: number;
  persona?: "student" | "gym_freak" | "office_worker";
}

export interface Meal {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  description: string;
  ingredients: string[];
  steps: string[];
  type: "breakfast" | "lunch" | "dinner" | "snack";
  isVeg: boolean;
  isVegan: boolean;
}

export interface DayPlan {
  day: number;
  meals: Meal[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFats: number;
}

export interface DietPlan {
  dailyCalories: number;
  bmr: number;
  tdee: number;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  days: DayPlan[];
  dietScore: number;
}
