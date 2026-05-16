
// src/tests/calculations.test.ts
import {
  calculateBMI, calculateLBM, calculateBMR, calculateTDEE,
  calculateMacros, computeTargets, calculateGaps,
  calculateRingOffset, getMealTotal, getAllMealsTotal,
  getInitials, getGoalLabel, getDeficitType,
} from "../features/diet-plan/logic/calculations";
import type { Meal } from "../features/diet-plan/types";

describe("calculateBMI", () => {
  test("يحسب صح",          () => expect(calculateBMI(68.4, 170)).toBe(23.7));
  test("weight=0 → 0",     () => expect(calculateBMI(0, 170)).toBe(0));
  test("height=0 → 0",     () => expect(calculateBMI(70, 0)).toBe(0));
});

describe("calculateLBM", () => {
  test("يحسب صح",          () => expect(calculateLBM(68.4, 26)).toBe(50.6));
  test("bodyfat=0 → وزن",  () => expect(calculateLBM(70, 0)).toBe(70));
  test("bodyfat=100 → 0",  () => expect(calculateLBM(70, 100)).toBe(0));
});

describe("calculateBMR", () => {
  const m = { weight: 80, height: 177, age: 30, gender: "male" as const, lbm: 59.2 };
  test("katch صح",         () => expect(calculateBMR("katch", m)).toBeCloseTo(1648.72, 0));
  test("harris في النطاق", () => { const r = calculateBMR("harris", m); expect(r).toBeGreaterThan(1800); expect(r).toBeLessThan(2100); });
  test("mifflin صح",       () => expect(calculateBMR("mifflin", m)).toBeCloseTo(1761, 0));
  test("أنثى < ذكر",       () => expect(calculateBMR("harris", { ...m, gender: "female" })).toBeLessThan(calculateBMR("harris", m)));
});

describe("calculateTDEE", () => {
  test("يحسب صح",          () => expect(calculateTDEE(1648, 1.55)).toBe(2554));
  test("low < high",       () => expect(calculateTDEE(1648, 1.2)).toBeLessThan(calculateTDEE(1648, 1.9)));
});

describe("calculateMacros", () => {
  test("pro = w × 2.2",    () => expect(calculateMacros(2000, 80).pro).toBe(176));
  test("fat صح",           () => expect(calculateMacros(2000, 80).fat).toBe(33));
  test("carb موجب",        () => expect(calculateMacros(2000, 80).carb).toBeGreaterThan(0));
});

describe("computeTargets", () => {
  const base = {
    firstName: "", lastName: "", neck: 0, waist: 0,
    weight: 68.4, height: 170, age: 30, bodyfat: 26,
    activity: 1.55, deficit: 500, gender: "female" as const,
    goal: "loss" as const, equation: "katch" as const,
  };
  test("يرجع كل الـ keys",  () => { const r = computeTargets(base); ["cal","pro","fat","carb","lbm","tdee"].forEach(k => expect(r).toHaveProperty(k)); });
  test("cal >= 1200",        () => expect(computeTargets({ ...base, deficit: 99999 }).cal).toBeGreaterThanOrEqual(1200));
  test("gain > loss",        () => expect(computeTargets({ ...base, goal: "gain" }).cal).toBeGreaterThan(computeTargets(base).cal));
  test("maintain = tdee",    () => { const r = computeTargets({ ...base, goal: "maintain" }); expect(r.cal).toBe(r.tdee); });
});

describe("calculateGaps", () => {
  const t = { cal: 2000, pro: 150, carb: 200 };
  test("calGap موجب",       () => expect(calculateGaps(2500, t).calGap).toBe(500));
  test("calGap سالب",       () => expect(calculateGaps(1500, t).calGap).toBe(-500));
  test("proGap >= 0",        () => expect(calculateGaps(99999, t).proGap).toBeGreaterThanOrEqual(0));
});

describe("calculateRingOffset", () => {
  const c = 2 * Math.PI * 27;
  test("0% → full offset",  () => expect(calculateRingOffset(0)).toBeCloseTo(c, 0));
  test("100% → 0",          () => expect(calculateRingOffset(1)).toBe(0));
  test(">1 → 0",            () => expect(calculateRingOffset(1.5)).toBe(0));
});

describe("getMealTotal", () => {
  test("يجمع صح",           () => expect(getMealTotal([{ name:"A", kcal:70 }, { name:"B", kcal:120 }])).toBe(190));
  test("فاضي = 0",          () => expect(getMealTotal([])).toBe(0));
});

describe("getAllMealsTotal", () => {
  const meals: Meal[] = [
    { id:"1", name:"", icon:"", suggested:"", foods:[{ name:"", kcal:342 }] },
    { id:"2", name:"", icon:"", suggested:"", foods:[{ name:"", kcal:600 }, { name:"", kcal:100 }] },
    { id:"3", name:"", icon:"", suggested:"", foods:[] },
  ];
  test("يجمع كل الوجبات",   () => expect(getAllMealsTotal(meals)).toBe(1042));
  test("قايمة فاضية = 0",   () => expect(getAllMealsTotal([])).toBe(0));
});

describe("getInitials", () => {
  test("Sarah Jenkins → SJ",() => expect(getInitials("Sarah","Jenkins")).toBe("SJ"));
  test("اسم واحد → S",      () => expect(getInitials("Sarah","")).toBe("S"));
  test("فاضي → ?",           () => expect(getInitials("","")).toBe("?"));
});

describe("getGoalLabel", () => {
  test("loss",               () => expect(getGoalLabel("loss")).toBe("Weight Loss"));
  test("gain",               () => expect(getGoalLabel("gain")).toBe("Weight Gain"));
  test("maintain",           () => expect(getGoalLabel("maintain")).toBe("Maintain"));
});

describe("getDeficitType", () => {
  test("موجب → warn",        () => expect(getDeficitType(100)).toBe("warn"));
  test("سالب → bad",         () => expect(getDeficitType(-100)).toBe("bad"));
  test("صفر → warn",         () => expect(getDeficitType(0)).toBe("warn"));
});