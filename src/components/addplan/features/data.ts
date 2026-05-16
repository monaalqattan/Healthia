// src/features/diet-plan/data.ts
// البيانات الابتدائية — يعتمد على types + constants

import type { Meal } from "./types";
export { INITIAL_FORM, INITIAL_TARGETS } from "./constants";

export const INITIAL_MEALS: Meal[] = [
  { id: "bf",     name: "Breakfast", icon: "🌅", suggested: "450–500 kcal", foods: [] },
  { id: "lunch",  name: "Lunch",     icon: "🥗", suggested: "600–700 kcal", foods: [] },
  { id: "dinner", name: "Dinner",    icon: "🌙", suggested: "500–600 kcal", foods: [] },
  { id: "snack",  name: "Snacks",    icon: "🍎", suggested: "~200 kcal",    foods: [] },
];