// src/features/diet-plan/constants.ts
// كل القيم الثابتة — يعتمد على types.ts فقط

import type { EquationOption, ActivityOption, PatientForm, DietTargets } from "./types";

export const EQUATIONS: EquationOption[] = [
  { key: "katch",   label: "Katch-McArdle"   },
  { key: "harris",  label: "Harris-Benedict"  },
  { key: "mifflin", label: "Mifflin-St Jeor"  },
];

export const ACTIVITY_OPTIONS: ActivityOption[] = [
  { value: 1.2,   label: "Sedentary"   },
  { value: 1.375, label: "Light"       },
  { value: 1.55,  label: "Moderate"    },
  { value: 1.725, label: "Active"      },
  { value: 1.9,   label: "Very Active" },
];

export const DAYS_OF_WEEK = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"] as const;
export const PAGE_TABS    = ["Patient Overview","Nutritional Goals","History"] as const;

export const MIN_CALORIES      = 1200;
export const PROTEIN_PER_KG    = 2.2;
export const FAT_PERCENTAGE    = 0.15;
export const CALORIES_PER_GRAM = { protein: 4, fat: 9, carb: 4 } as const;
export const RING_RADIUS       = 27;

export const INITIAL_FORM: PatientForm = {
  firstName: "", lastName: "", gender: "female", goal: "loss",
  weight: 0, height: 0, age: 0, activity: 1.55,
  deficit: 500, bodyfat: 0, neck: 0, waist: 0,
};

export const INITIAL_TARGETS: DietTargets = {
  cal: 0, pro: 0, fat: 0, carb: 0, lbm: 0, tdee: 0,
};