export type Gender      = "male" | "female";
export type Goal        = "loss" | "gain" | "maintain";
export type Equation    = "katch" | "harris" | "mifflin";
export type DeficitType = "ok" | "warn" | "bad";

export interface PatientForm {
  firstName: string;
  lastName:  string;
  gender:    Gender;
  goal:      Goal;
  weight:    number;
  height:    number;
  age:       number;
  activity:  number;
  deficit:   number;
  bodyfat:   number;
  neck:      number;
  waist:     number;
}

export interface DietTargets {
  cal:  number;
  pro:  number;
  fat:  number;
  carb: number;
  lbm:  number;
  tdee: number;
}

export interface Macros { pro: number; fat: number; carb: number; }

// ✅ FoodItem اتوسّع: بقى فيه الماكروز عشان نخصمها ونحسبها
export interface FoodItem {
  foodId?:  string;   // الـ _id بتاع الأكلة في الداتابيز
  name:     string;
  kcal:     number;
  protein?: number;
  carbs?:   number;
  fat?:     number;
  quantity?: string;  // مثال: "كوب مطبوخ"
}

export interface Meal { id: string; name: string; icon: string; suggested: string; foods: FoodItem[]; }
export interface NutritionGaps { calGap: number; proGap: number; carbGap: number; }
export interface BMRInput { weight: number; height: number; age: number; gender: Gender; lbm: number; }
export interface ActivityOption { value: number; label: string; }
export interface EquationOption { key: Equation; label: string; }

export interface RingProps { value: string | number; unit: string; offset?: number; }

export interface MealBlockProps {
  icon: string; name: string; suggested: string;
  foods: FoodItem[];
  onAddFood: () => void;
  onRemoveFood?: (index: number) => void; // ✅ زرار حذف صنف
  defaultOpen?: boolean;
}

export interface PatientBarProps { firstName: string; lastName: string; weight: number; height: number; goal: Goal; }
export interface DietCalculatorProps {
  form: PatientForm;
  onFormChange: (key: keyof PatientForm, value: string | number) => void;
  equation: Equation; onEqChange: (eq: Equation) => void;
  onCalculate: () => void; targets: DietTargets;
}
export interface MealStructureProps {
  meals: Meal[];
  onAddFood: (mealId: string) => void;
  onRemoveFood?: (mealId: string, index: number) => void;
  onAddMeal: () => void;
  onSave?: () => void;          // ✅ حفظ في الباك
  targets: DietTargets;
  totalEaten: number;
}