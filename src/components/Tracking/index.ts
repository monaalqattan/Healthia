import { Scale, Target, Activity, Flame, Droplets, Footprints, Trophy, Dumbbell, Zap } from "lucide-react";
import type { Range, WeightPoint, SleepPoint, StatCardData, AchievementData } from "../types";

export const weightData: Record<Range, WeightPoint[]> = {
  week: [
    { label: "Mon", actual: 73.0, target: 73.0 },
    { label: "Tue", actual: 72.7, target: 72.7 },
    { label: "Wed", actual: 72.5, target: 72.4 },
    { label: "Thu", actual: 72.2, target: 72.1 },
    { label: "Fri", actual: 71.9, target: 71.9 },
    { label: "Sat", actual: 71.6, target: 71.6 },
    { label: "Sun", actual: 70.6, target: 71.3 },
  ],
  month: [
    { label: "W1", actual: 73.0, target: 73.0 },
    { label: "W2", actual: 72.1, target: 72.3 },
    { label: "W3", actual: 71.3, target: 71.7 },
    { label: "W4", actual: 70.6, target: 71.0 },
  ],
  "3m": [
    { label: "Jan", actual: 76.0, target: 76.0 },
    { label: "Feb", actual: 74.8, target: 74.7 },
    { label: "Mar", actual: 73.5, target: 73.3 },
    { label: "Apr", actual: 72.1, target: 72.0 },
    { label: "May", actual: 71.0, target: 70.7 },
    { label: "Jun", actual: 70.6, target: 69.3 },
  ],
};

export const sleepData: SleepPoint[] = [
  { day: "Mon", hours: 6.5 },
  { day: "Tue", hours: 7.0 },
  { day: "Wed", hours: 8.0 },
  { day: "Thu", hours: 7.5 },
  { day: "Fri", hours: 6.0 },
  { day: "Sat", hours: 8.5 },
  { day: "Sun", hours: 7.5 },
];

export const statCards: StatCardData[] = [
  { icon: Scale,     label: "Current Weight", value: "70.6", unit: "kg",    color: "bg-emerald-50 text-emerald-600" },
  { icon: Target,    label: "Goal Weight",    value: "68",   unit: "kg",    color: "bg-blue-50 text-blue-600" },
  { icon: Activity,  label: "BMI",            value: "23.4", unit: "kg/m²", color: "bg-pink-50 text-pink-600" },
  { icon: Flame,     label: "Calories Burned",value: "1,850",unit: "kcal",  color: "bg-amber-50 text-amber-600" },
  { icon: Droplets,  label: "Water Intake",   value: "1.8",  unit: "L",     color: "bg-sky-50 text-sky-600" },
  { icon: Footprints,label: "Steps",          value: "8,420",               color: "bg-violet-50 text-violet-600" },
];

export const achievements: AchievementData[] = [
  {
    icon: Trophy,
    title: "Lost 3 kg",
    desc: "Milestone reached",
    pct: 100,
    bg: "bg-emerald-50",
    color: "#16a34a",
    iconColor: "text-emerald-600",
  },
  {
    icon: Dumbbell,
    title: "10 Workouts",
    desc: "Completed this month",
    pct: 83,
    bg: "bg-violet-50",
    color: "#7c3aed",
    iconColor: "text-violet-600",
  },
  {
    icon: Zap,
    title: "7-Day Streak",
    desc: "Logging every day",
    pct: 100,
    bg: "bg-amber-50",
    color: "#d97706",
    iconColor: "text-amber-600",
    streak: true,
  },
  {
    icon: Footprints,
    title: "Steps Goal",
    desc: "8,420 / 10,000",
    pct: 84,
    bg: "bg-zinc-50",
    color: "#71717a",
    iconColor: "text-zinc-500",
  },
];
