// Daily Check-up Card — في صفحة المريض
// زرار أخضر يفتح form يسجل فيه المريض يومياته وتروح للدكتور

import { useState } from "react"
import { ClipboardCheck, Droplets, Moon, Smile, Dumbbell, X, Save, ChevronDown } from "lucide-react"
import { usePatients } from "@/store/patientsStore"
import type { CheckupAnswer } from "@/store/patientsStore"

const MOODS = [
  { value: "great", emoji: "😄", label: "Great",  color: "border-green-400 bg-green-50 text-green-700"  },
  { value: "good",  emoji: "🙂", label: "Good",   color: "border-blue-400 bg-blue-50 text-blue-700"    },
  { value: "ok",    emoji: "😐", label: "OK",     color: "border-yellow-400 bg-yellow-50 text-yellow-700" },
  { value: "bad",   emoji: "😔", label: "Bad",    color: "border-red-400 bg-red-50 text-red-500"       },
] as const

export default function DailyCheckupCard() {
  const { patients, selectedId, updatePatient } = usePatients()
  const patient = patients.find(p => p.id === selectedId) ?? patients[0]

  const [open,  setOpen]  = useState(false)
  const [saved, setSaved] = useState(false)
  const [form,  setForm]  = useState({
    water:    0,
    sleep:    7,
    mood:     "good" as CheckupAnswer["mood"],
    exercise: false,
    note:     "",
  })

  const today = new Date().toISOString().split("T")[0]
  const alreadyDone = patient?.checkups?.some(c => c.date === today)

  const handleSave = () => {
    if (!patient) return
    const entry: CheckupAnswer = { date: today, ...form }
    updatePatient(patient.id, {
      checkups: [entry, ...(patient.checkups || [])],
      lastCheckIn: new Date().toLocaleString("en-US", {
        month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
      }),
    })
    setSaved(true)
    setTimeout(() => { setSaved(false); setOpen(false) }, 1800)
  }

  return (
    <>
      {/* ── Green Banner Button ── */}
      <div
        onClick={() => !alreadyDone && setOpen(true)}
        className={`rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all mb-4
          ${alreadyDone
            ? "bg-green-50 border border-green-200"
            : "bg-green-700 hover:bg-green-800 shadow-md"
          }`}
      >
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0
            ${alreadyDone ? "bg-green-200" : "bg-green-600"}`}>
            <ClipboardCheck size={18} className={alreadyDone ? "text-green-700" : "text-white"} />
          </div>
          <div>
            <p className={`font-semibold text-sm ${alreadyDone ? "text-green-800" : "text-white"}`}>
              {alreadyDone ? "✓ Daily Check-up Completed!" : "Daily Check-up & Notes"}
            </p>
            <p className={`text-xs mt-0.5 ${alreadyDone ? "text-green-600" : "text-green-100"}`}>
              {alreadyDone
                ? "You've already logged today — great job!"
                : "Click here to log your daily health update"}
            </p>
          </div>
        </div>
        {!alreadyDone && (
          <ChevronDown size={18} className="text-green-100 flex-shrink-0" />
        )}
      </div>

      {/* ── Modal Form ── */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-4 pb-4 sm:pb-0">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">

            {/* Header */}
            <div className="flex justify-between items-center p-5 pb-3 sticky top-0 bg-white rounded-t-3xl border-b border-gray-100">
              <div>
                <h2 className="font-bold text-gray-800">Daily Check-up</h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })}
                </p>
              </div>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X size={18} />
              </button>
            </div>

            <div className="p-5 flex flex-col gap-5">

              {/* Water */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Droplets size={15} className="text-blue-500" />
                  <span className="text-sm font-semibold text-gray-700">Water Intake</span>
                  <span className="ml-auto text-sm font-bold text-blue-600">{form.water} glasses</span>
                </div>
                <input type="range" min={0} max={15} value={form.water}
                  onChange={e => setForm(p => ({ ...p, water: +e.target.value }))}
                  className="w-full accent-blue-500" />
                <div className="flex justify-between text-xs text-gray-300 mt-1">
                  <span>0</span><span className="text-blue-400">8 goal</span><span>15</span>
                </div>
              </div>

              {/* Sleep */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Moon size={15} className="text-indigo-500" />
                  <span className="text-sm font-semibold text-gray-700">Sleep Hours</span>
                  <span className="ml-auto text-sm font-bold text-indigo-600">{form.sleep}h</span>
                </div>
                <input type="range" min={0} max={12} value={form.sleep}
                  onChange={e => setForm(p => ({ ...p, sleep: +e.target.value }))}
                  className="w-full accent-indigo-500" />
              </div>

              {/* Mood */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Smile size={15} className="text-yellow-500" />
                  <span className="text-sm font-semibold text-gray-700">How are you feeling?</span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {MOODS.map(m => (
                    <button key={m.value} onClick={() => setForm(p => ({ ...p, mood: m.value }))}
                      className={`py-2 rounded-xl text-xs font-semibold border-2 transition-all
                        ${form.mood === m.value ? m.color : "border-gray-100 text-gray-400 hover:bg-gray-50"}`}>
                      <div className="text-lg mb-0.5">{m.emoji}</div>
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Exercise */}
              <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                <div className="flex items-center gap-2">
                  <Dumbbell size={15} className="text-green-600" />
                  <span className="text-sm font-semibold text-gray-700">Exercised today?</span>
                </div>
                <button onClick={() => setForm(p => ({ ...p, exercise: !p.exercise }))}
                  className={`w-12 h-6 rounded-full transition-all relative flex-shrink-0
                    ${form.exercise ? "bg-green-600" : "bg-gray-300"}`}>
                  <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all
                    ${form.exercise ? "left-6" : "left-0.5"}`} />
                </button>
              </div>

              {/* Note */}
              <div>
                <label className="text-sm font-semibold text-gray-700 block mb-2">
                  Today's Note <span className="text-gray-400 font-normal">(optional)</span>
                </label>
                <textarea value={form.note} onChange={e => setForm(p => ({ ...p, note: e.target.value }))}
                  placeholder="How was your day? Any symptoms, meals, or thoughts to share with your doctor..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-green-400 resize-none" />
              </div>

              {/* Submit */}
              <button onClick={handleSave}
                className={`flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold transition-all
                  ${saved
                    ? "bg-green-100 text-green-700"
                    : "bg-green-700 text-white hover:bg-green-800 shadow-md"
                  }`}>
                <Save size={15} />
                {saved ? "Sent to your doctor ✓" : "Submit Daily Check-up"}
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  )
}