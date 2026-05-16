// src/features/diet-plan/logic/calculations.ts
// كل الحسابات — equations مضبوطة 100%

import type {
  Equation, Goal, BMRInput, Macros,
  DietTargets, PatientForm, NutritionGaps, DeficitType, Meal, FoodItem,
} from "../types";
import {
  MIN_CALORIES, PROTEIN_PER_KG, FAT_PERCENTAGE,
  CALORIES_PER_GRAM, RING_RADIUS,
} from "../constants";

// ── Body Composition ──────────────────────────────────────────────────────────

export function calculateBMI(weight: number, height: number): number {
  if (!weight || !height) return 0;
  return +(weight / (height / 100) ** 2).toFixed(1);
}

export function calculateLBM(weight: number, bodyfat: number): number {
  // Lean Body Mass = weight × (1 - bodyfat%)
  if (bodyfat <= 0 || bodyfat >= 100) return weight;
  return +(weight * (1 - bodyfat / 100)).toFixed(1);
}

// ── Metabolic Rate — كل معادلة مضبوطة ───────────────────────────────────────

export function calculateBMR(equation: Equation, input: BMRInput): number {
  const { weight, height, age, gender, lbm } = input;

  switch (equation) {
    // Katch-McArdle: يعتمد على LBM فقط
    case "katch":
      return Math.round(370 + 21.6 * lbm);

    // Harris-Benedict (المراجعة 1984)
    case "harris":
      return Math.round(
        gender === "male"
          ? 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age
          : 447.593 + 9.247 * weight + 3.098 * height - 4.330 * age
      );

    // Mifflin-St Jeor (الأدق للغالبية)
    case "mifflin":
      return Math.round(
        gender === "male"
          ? 10 * weight + 6.25 * height - 5 * age + 5
          : 10 * weight + 6.25 * height - 5 * age - 161
      );

    default:
      return 0;
  }
}

export function calculateTDEE(bmr: number, activity: number): number {
  return Math.round(bmr * activity);
}

// ── Macros — protein أول، دهون ثاني، الباقي carbs ───────────────────────────

export function calculateMacros(calories: number, weight: number): Macros {
  // Protein: 2.2g per kg of bodyweight
  const pro = Math.round(weight * PROTEIN_PER_KG);

  // Fat: 15% of total calories
  const fat = Math.round((calories * FAT_PERCENTAGE) / CALORIES_PER_GRAM.fat);

  // Carbs: ما تبقى من السعرات
  const proteinCals = pro * CALORIES_PER_GRAM.protein;
  const fatCals     = fat * CALORIES_PER_GRAM.fat;
  const carb        = Math.max(0, Math.round((calories - proteinCals - fatCals) / CALORIES_PER_GRAM.carb));

  return { pro, fat, carb };
}

// ── Main Computation ⭐ ───────────────────────────────────────────────────────

export function computeTargets(
  formData: PatientForm & { equation: Equation }
): DietTargets {
  const { weight, height, age, bodyfat, activity, deficit, gender, goal, equation } = formData;

  const lbm  = calculateLBM(weight, bodyfat);
  const bmr  = calculateBMR(equation, { weight, height, age, gender, lbm });
  const tdee = calculateTDEE(bmr, activity);

  // Calorie target based on goal
  let cal: number;
  if (goal === "loss")     cal = Math.max(MIN_CALORIES, tdee - deficit);
  else if (goal === "gain") cal = tdee + deficit;
  else                      cal = tdee; // maintain

  const { pro, fat, carb } = calculateMacros(cal, weight);

  return { cal, pro, fat, carb, lbm, tdee };
}

// ── Gaps — كام باقي من الـ target ──────────────────────────────────────────

export function calculateGaps(
  totalEaten: number,
  targets: Pick<DietTargets, "cal" | "pro" | "carb">
): NutritionGaps {
  return {
    // سالب = ما أكلتيش الكمية دي لسه | موجب = زيادة
    calGap:  totalEaten - targets.cal,
    proGap:  totalEaten > 0
      ? Math.max(0, targets.pro - Math.round((totalEaten * 0.30) / CALORIES_PER_GRAM.protein))
      : targets.pro,
    carbGap: totalEaten > 0
      ? Math.round((totalEaten * 0.50) / CALORIES_PER_GRAM.carb) - targets.carb
      : -targets.carb,
  };
}

// ── Ring Offset — SVG strokeDashoffset ───────────────────────────────────────

export function calculateRingOffset(percentage: number): number {
  const circumference = 2 * Math.PI * RING_RADIUS;
  // percentage = 0 → ring فاضية (offset = circumference)
  // percentage = 1 → ring ممتلية (offset = 0)
  const clamped = Math.min(Math.max(percentage, 0), 1);
  return +(circumference * (1 - clamped)).toFixed(1);
}

// ── Meal Totals ───────────────────────────────────────────────────────────────

export function getMealTotal(foods: FoodItem[]): number {
  return foods.reduce((sum, f) => sum + f.kcal, 0);
}

export function getAllMealsTotal(meals: Meal[]): number {
  return meals.reduce((sum, m) => sum + getMealTotal(m.foods), 0);
}

// ── UI Helpers ────────────────────────────────────────────────────────────────

export function getInitials(firstName: string, lastName: string): string {
  return ((firstName[0] ?? "") + (lastName[0] ?? "")).toUpperCase() || "?";
}

export function getGoalLabel(goal: Goal): string {
  const labels: Record<Goal, string> = {
    loss:     "Weight Loss",
    gain:     "Weight Gain",
    maintain: "Maintain",
  };
  return labels[goal];
}

export function getDeficitType(gap: number): DeficitType {
  if (gap >= 0)    return "warn"; // أكلت بالظبط أو أكتر
  if (gap > -200)  return "ok";  // قريب من الـ target
  return "bad";                   // ناقص كتير
}