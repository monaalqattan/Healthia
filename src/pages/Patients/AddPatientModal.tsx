import { useState } from "react"
import { X } from "lucide-react"

interface PatientFormState {
  name: string
  phone: string
  email: string
  password: string
  category: string
  period: string
  startDate: string
  initialPaymentAmount: string
  weight: string
  height: string
}

export interface NewPatientData extends Omit<
  PatientFormState,
  "initialPaymentAmount" | "weight" | "height"
> {
  clientType: "online" | "offline"
  initialPaymentAmount: number
  weight: number
  height: number
}

interface Props {
  onClose: () => void
  onCreate: (
    data: NewPatientData
  ) => Promise<{ patientId?: string; error?: string }>
  patientCount?: number
}

const CATEGORIES = [
  "Nutrition & Wellness",
  "Weight Management",
  "Sports Nutrition",
  "Clinical Diet",
]
const PERIODS = [
  "1 Month Program",
  "3 Months Program",
  "6 Months Program",
  "1 Year Program",
]

export default function AddPatientModal({ onClose, onCreate }: Props) {
  const [clientType, setClientType] = useState<"online" | "offline">("online")
  const [form, setForm] = useState<PatientFormState>({
    name: "",
    phone: "",
    email: "",
    password: "",
    category: "Nutrition & Wellness",
    period: "3 Months Program",
    startDate: "",
    initialPaymentAmount: "",
    weight: "",
    height: "",
  })

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const set = (key: string, val: string) =>
    setForm((p) => ({ ...p, [key]: val }))

  const validateEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const validatePassword = (password: string) =>
    /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(
      password
    )

  const handleSubmit = async () => {
    setError("")
    if (!form.name || !form.email || !form.password) {
      setError("Name, email and password are required.")
      return
    }
    if (!validateEmail(form.email)) {
      setError("Please enter a valid email address.")
      return
    }
    if (!validatePassword(form.password)) {
      setError(
        "Password must be at least 8 characters and include letters, numbers, and symbols (e.g. Patient@1234)."
      )
      return
    }
    setLoading(true)
    const result = await onCreate({
      ...form,
      clientType,
      initialPaymentAmount: parseFloat(form.initialPaymentAmount) || 0,
      weight: parseFloat(form.weight) || 0,
      height: parseFloat(form.height) || 0,
    })
    setLoading(false)
    if (result?.error) setError(result.error)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between p-6 pb-4">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Add New Patient</h2>
            <p className="mt-0.5 text-xs text-gray-400">
              Register a new profile to start tracking vitality data
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-4 px-6 pb-6">
          {/* Name + Patient ID (auto) */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
                Full Name
              </label>
              <input
                value={form.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="e.g. Sarah Jenkins"
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
                Patient ID
              </label>
              <input
                value="Auto-generated"
                readOnly
                className="mt-1 w-full cursor-not-allowed rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-400"
              />
            </div>
          </div>

          {/* Phone + Email */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
                Phone Number
              </label>
              <input
                value={form.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="+1 (555) 000-0000"
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
                Email Address
              </label>
              <input
                value={form.email}
                onChange={(e) => set("email", e.target.value)}
                placeholder="sarah.j@example.com"
                type="email"
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-green-500"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
              Temporary Password
            </label>
            <input
              value={form.password}
              onChange={(e) => set("password", e.target.value)}
              type="text"
              placeholder="e.g. Patient@1234"
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-green-500"
            />
          </div>

          {/* Client Type */}
          <div>
            <label className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
              Client Type
            </label>
            <div className="mt-1 flex overflow-hidden rounded-lg border border-gray-200">
              {(["online", "offline"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setClientType(t)}
                  className={`flex-1 py-2 text-sm font-medium capitalize transition-colors ${clientType === t ? "bg-green-700 text-white" : "text-gray-500 hover:bg-gray-50"}`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-green-500"
            >
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Period + Start Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
                Period
              </label>
              <select
                value={form.period}
                onChange={(e) => set("period", e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-green-500"
              >
                {PERIODS.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
                Start Date
              </label>
              <input
                value={form.startDate}
                onChange={(e) => set("startDate", e.target.value)}
                type="date"
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-green-500"
              />
            </div>
          </div>

          {/* Weight + Height */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
                Weight (kg)
              </label>
              <input
                value={form.weight}
                onChange={(e) => set("weight", e.target.value)}
                type="number"
                placeholder="0"
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
                Height (cm)
              </label>
              <input
                value={form.height}
                onChange={(e) => set("height", e.target.value)}
                type="number"
                placeholder="0"
                className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm outline-none focus:border-green-500"
              />
            </div>
          </div>

          {/* Payment */}
          <div>
            <label className="text-[10px] font-semibold tracking-wide text-gray-400 uppercase">
              Initial Payment Amount
            </label>
            <div className="relative mt-1">
              <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-gray-400">
                $
              </span>
              <input
                value={form.initialPaymentAmount}
                onChange={(e) => set("initialPaymentAmount", e.target.value)}
                type="number"
                placeholder="0.00"
                className="w-full rounded-lg border border-gray-200 py-2 pr-3 pl-7 text-sm outline-none focus:border-green-500"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-600">
              {error}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 rounded-xl border border-gray-200 py-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 rounded-xl bg-green-700 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green-800 disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create Profile"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
