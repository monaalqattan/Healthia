// src/features/diet-plan/logic/selectors.ts

import type { Meal, DietTargets, NutritionGaps } from "../types";
import { getAllMealsTotal, calculateGaps, calculateRingOffset } from "./calculations";

export interface RingItem {
  label: string;
  value: string | number;
  unit: string;
  offset: number;
  color?: string;
}

export interface StatItem {
  label: string;
  value: string | number;
  green?: boolean;
}

// ── Ring Items — كل ring بتتحسب على أساس totalEaten / target ──────────────

export function selectRingItems(
  targets: DietTargets,
  totalEaten: number = 0,
  totalProEaten: number = 0,
  totalCarbEaten: number = 0,
  totalFatEaten: number = 0,
): RingItem[] {
  const calPct  = targets.cal  > 0 ? totalEaten     / targets.cal  : 0;
  const proPct  = targets.pro  > 0 ? totalProEaten  / targets.pro  : 0;
  const carbPct = targets.carb > 0 ? totalCarbEaten / targets.carb : 0;
  const fatPct  = targets.fat  > 0 ? totalFatEaten  / targets.fat  : 0;

  return [
    {
      label: "Calories",
      value: targets.cal > 0 ? targets.cal : "—",
      unit: "kcal",
      offset: calculateRingOffset(calPct),
    },
    {
      label: "Protein",
      value: targets.pro > 0 ? `${targets.pro}g` : "—",
      unit: "protein",
      offset: calculateRingOffset(proPct),
    },
    {
      label: "Carbs",
      value: targets.carb > 0 ? `${targets.carb}g` : "—",
      unit: "carbs",
      offset: calculateRingOffset(carbPct),
    },
    {
      label: "Fats",
      value: targets.fat > 0 ? `${targets.fat}g` : "—",
      unit: "fats",
      offset: calculateRingOffset(fatPct),
    },
  ];
}

export function selectTotalEaten(meals: Meal[]): number {
  return getAllMealsTotal(meals);
}

export function selectNutritionGaps(meals: Meal[], targets: DietTargets): NutritionGaps {
  return calculateGaps(selectTotalEaten(meals), targets);
}

export function selectPatientStats(
  weight: number,
  height: number,
  bmi: number,
  goalText: string,
): StatItem[] {
  return [
    { label: "Weight",       value: `${weight} kg` },
    { label: "Height",       value: `${height} cm` },
    { label: "BMI",          value: bmi             },
    { label: "Primary Goal", value: goalText, green: true },
  ];
}