// src/lib/api.ts
const BASE_URL =
  import.meta.env.VITE_API_URL ?? "https://healthia-backend.vercel.app/api"

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem("token")
  return token ? { Authorization: `Bearer ${token}` } : {}
}

// ─────────────────────────── تسجيل الدخول ───────────────────────────
export interface LoggedUser {
  id: string
  name: string
  email: string
  role: "doctor" | "patient" | "superadmin"
}

export async function loginRequest(
  email: string,
  password: string
): Promise<{ token: string; user: LoggedUser }> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message ?? "Login failed")
  return data
}

// ─────────────────────────── مرضى الدكتور ───────────────────────────
export interface ApiPatient {
  _id: string
  name: string
  email?: string
  weight?: number
  height?: number
}

export async function fetchMyPatients(): Promise<ApiPatient[]> {
  const res = await fetch(`${BASE_URL}/patients`, {
    headers: { ...authHeaders() },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message ?? "Failed to load patients")
  return data
}

// ─────────────────────────── الأكل ───────────────────────────
export interface ApiFood {
  _id: string
  name: string
  category: string
  quantity?: string
  calories: number
  protein: number
  carbs: number
  fat: number
}

export async function fetchFoods(opts?: {
  category?: string
  search?: string
}): Promise<ApiFood[]> {
  const params = new URLSearchParams()
  if (opts?.category) params.set("category", opts.category)
  if (opts?.search) params.set("search", opts.search)

  const res = await fetch(`${BASE_URL}/foods?${params.toString()}`)
  if (!res.ok) throw new Error("Failed to load foods")
  return res.json()
}

// ─────────────────────────── حفظ الدايت بلان ───────────────────────────
export interface SavePlanPayload {
  patient: string
  title: string
  category?: string
  description?: string
  notes?: string
  caloriesTarget: number
  protein: number
  carbs: number
  fats: number
  startDate?: string
  days?: any[]
  meals?: Array<{
    type: "BREAKFAST" | "LUNCH" | "DINNER" | "SNACKS"
    name: string
    calories: number
  }>
  calculatorData?: {
    equation?: string
    firstName?: string
    lastName?: string
    gender?: string
    goal?: string
    weight?: number
    height?: number
    age?: number
    activityLevel?: string
    calorieDef?: number
    bodyFat?: number
    neck?: number
    waist?: number
  }
}

export async function savePlan(payload: SavePlanPayload) {
  const res = await fetch(`${BASE_URL}/plans`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message ?? "Failed to save the plan")
  return data
}

// ─────────────────────────── جيب plans المريض ───────────────────────────
export async function fetchPatientPlans(patientId: string) {
  const res = await fetch(`${BASE_URL}/plans/patient/${patientId}`, {
    headers: { ...authHeaders() },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message ?? "Failed to load plans")
  return data // array of plans
}

// ─────────────────────────── تعديل plan موجودة ───────────────────────────
export async function updatePlan(
  planId: string,
  payload: Partial<SavePlanPayload>
) {
  const res = await fetch(`${BASE_URL}/plans/${planId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message ?? "Failed to update the plan")
  return data
}
// ─────────────────────────── المريض يعلّم يوم كـ completed ───────────────────────────
export async function markDayCompleted(
  planId: string,
  day: string,
  completed: boolean
) {
  const res = await fetch(`${BASE_URL}/plans/${planId}/day-completed`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ day, completed }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message ?? "Failed to update the day")
  return data
}
