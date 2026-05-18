// src/components/Dashboard/types.ts

export interface Patient {
  id: string;
  name: string;
  avatar?: string;
  lastCheckIn: string;
  planStatus: 'active' | 'on-review' | 'lapsed';
  compliance: number;
}

export interface Alert {
  id: string;
  patientName: string;
  patientAvatar?: string;
  description: string;
  severity: 'critical' | 'warning';
  actions: string[];
}


export type Range = "week" | "month" | "3m"

export interface WeightPoint {
  label: string
  actual: number
  target: number
}

export interface SleepPoint {
  day: string
  hours: number
}

export interface StatCardData {
  icon: React.ElementType
  label: string
  value: string
  unit?: string
  color: string
}

export interface AchievementData {
  icon: React.ElementType
  title: string
  desc: string
  pct: number
  bg: string
  color: string
  iconColor: string
  streak?: boolean
}
