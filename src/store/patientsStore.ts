import { createContext, useContext } from "react"

export type PlanStatus = "active" | "on-review" | "lapsed"
export type ClientType = "Online" | "Offline"
export type Category   = "Nutrition & Wellness" | "Weight Management" | "Sports Nutrition" | "Clinical Diet"
export type Period     = "1 Month Program" | "3 Months Program" | "6 Months Program" | "1 Year Program"

export interface PatientNote {
  id: string; text: string; createdAt: string; author: string
}

export interface PatientAppointment {
  id: string; date: string; time: string; type: string; status: "upcoming" | "done" | "cancelled"
}

export interface CheckupAnswer {
  date: string
  water: number       // glasses
  sleep: number       // hours
  mood: "great" | "good" | "ok" | "bad"
  exercise: boolean
  note: string
}

export interface PatientRecord {
  id: string; name: string; email: string; password: string; phone: string
  clientType: ClientType; category: Category; period: Period
  startDate: string; payment: number; lastCheckIn: string
  planStatus: PlanStatus; compliance: number; avatar?: string
  weight: number; height: number; bmi: number; adherence: number; goals: string[]
  notes: PatientNote[]
  appointments: PatientAppointment[]
  checkups: CheckupAnswer[]
}

export interface PatientsContextType {
  patients:      PatientRecord[]
  addPatient:    (p: PatientRecord) => void
  updatePatient: (id: string, updates: Partial<PatientRecord>) => void
  deletePatient: (id: string) => void
  selectedId:    string | null
  selectPatient: (id: string) => void
}

export const PatientsContext = createContext<PatientsContextType>({
  patients: [], addPatient: () => {}, updatePatient: () => {},
  deletePatient: () => {}, selectedId: null, selectPatient: () => {},
})

export const usePatients = () => useContext(PatientsContext)

export function generatePatientId(count: number): string {
  return `#VT-${String(9000 + count).padStart(4, "0")}`
}
export function generatePassword(name: string): string {
  const clean = name.split(" ")[0].replace(/[^a-zA-Z]/g, "") || "User"
  return `Hvitality_2024_${clean.slice(0, 2).toUpperCase()}`
}
export function calcBMI(weight: number, height: number): number {
  if (!weight || !height) return 0
  return +(weight / (height / 100) ** 2).toFixed(1)
}

export const INITIAL_PATIENTS: PatientRecord[] = [
  {
    id: "#VT-9021", name: "Julian Rivers", email: "julian.r@email.com", password: "Hvitality_2024_JU",
    phone: "+1 555 001 0001", clientType: "Online", category: "Nutrition & Wellness",
    period: "3 Months Program", startDate: "2024-08-01", payment: 300,
    lastCheckIn: "Oct 24, 10:45 AM", planStatus: "active", compliance: 95,
    avatar: "https://i.pravatar.cc/150?u=1",
    weight: 78, height: 180, bmi: 24.1, adherence: 95,
    goals: ["Hydrate 8 Meals", "Active 2 Weeks", "Low Carb (5d)"],
    notes: [{ id: "n1", text: "Patient mentioned eating more protein this week. Suggested increasing vegetable intake.", createdAt: "2024-10-20 09:00", author: "Dr. Aris" }],
    appointments: [
      { id: "a1", date: "2024-10-28", time: "09:00 AM", type: "Follow-up", status: "upcoming" },
      { id: "a2", date: "2024-10-14", time: "10:00 AM", type: "Initial Consult", status: "done" },
    ],
    checkups: [{ date: "2024-10-24", water: 8, sleep: 7, mood: "great", exercise: true, note: "Felt energetic today" }],
  },
  {
    id: "#VT-8832", name: "Sarah Jenkins", email: "sarah.j@email.com", password: "Hvitality_2024_SA",
    phone: "+1 555 002 0002", clientType: "Online", category: "Weight Management",
    period: "3 Months Program", startDate: "2024-09-01", payment: 300,
    lastCheckIn: "Oct 24, 09:15 AM", planStatus: "on-review", compliance: 60,
    avatar: "https://i.pravatar.cc/150?u=2",
    weight: 68.4, height: 170, bmi: 22.1, adherence: 92,
    goals: ["Hydrate 6 Meals", "Active 1 Week", "Sugar-Free (12d)"],
    notes: [], appointments: [], checkups: [],
  },
  {
    id: "#VT-7719", name: "David Chen", email: "david.c@email.com", password: "Hvitality_2024_DA",
    phone: "+1 555 003 0003", clientType: "Offline", category: "Clinical Diet",
    period: "1 Month Program", startDate: "2024-10-01", payment: 150,
    lastCheckIn: "Oct 23, 04:30 PM", planStatus: "lapsed", compliance: 25,
    avatar: "https://i.pravatar.cc/150?u=3",
    weight: 92, height: 175, bmi: 30.0, adherence: 25,
    goals: ["Reduce Sugar", "Walk 30min Daily"],
    notes: [], appointments: [], checkups: [],
  },
  {
    id: "#VT-6543", name: "Emily Davis", email: "emily.d@email.com", password: "Hvitality_2024_EM",
    phone: "+1 555 004 0004", clientType: "Online", category: "Sports Nutrition",
    period: "6 Months Program", startDate: "2024-07-01", payment: 500,
    lastCheckIn: "Oct 22, 11:00 AM", planStatus: "active", compliance: 85,
    avatar: "https://i.pravatar.cc/150?u=4",
    weight: 62, height: 165, bmi: 22.8, adherence: 85,
    goals: ["Protein 120g/day", "Train 5x Week"],
    notes: [], appointments: [], checkups: [],
  },
  {
    id: "#VT-5432", name: "Michael Brown", email: "michael.b@email.com", password: "Hvitality_2024_MI",
    phone: "+1 555 005 0005", clientType: "Offline", category: "Weight Management",
    period: "3 Months Program", startDate: "2024-09-15", payment: 300,
    lastCheckIn: "Oct 21, 02:15 PM", planStatus: "on-review", compliance: 70,
    avatar: "https://i.pravatar.cc/150?u=5",
    weight: 105, height: 182, bmi: 31.7, adherence: 70,
    goals: ["Calorie Deficit 500", "Walk 45min Daily", "No Soda"],
    notes: [], appointments: [], checkups: [],
  },
]