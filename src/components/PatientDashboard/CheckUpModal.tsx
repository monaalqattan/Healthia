import { useState, useEffect } from 'react'
import { X, Droplets, Moon, Dumbbell, StickyNote, Save, Loader2 } from 'lucide-react'

export interface CheckUpData {
  waterIntake: number
  sleepHours:  number
  feeling:     'great' | 'good' | 'ok' | 'bad'
  exercised:   boolean
  notes:       string
}

interface CheckUpModalProps {
  open:         boolean
  onOpenChange: (open: boolean) => void
  onSubmit?:    (data: CheckUpData) => Promise<void> | void
}

const MOODS = [
  { value: 'great', emoji: '😄', label: 'Great', active: 'bg-[#065F46] text-white border-[#065F46]'       },
  { value: 'good',  emoji: '😊', label: 'Good',  active: 'bg-emerald-500 text-white border-emerald-500'   },
  { value: 'ok',    emoji: '😐', label: 'OK',    active: 'bg-teal-500 text-white border-teal-500'          },
  { value: 'bad',   emoji: '😢', label: 'Bad',   active: 'bg-emerald-900 text-white border-emerald-900'    },
] as const

export function CheckUpModal({ open, onOpenChange, onSubmit }: CheckUpModalProps) {
  const [data, setData] = useState<CheckUpData>({
    waterIntake: 0,
    sleepHours:  7,
    feeling:     'good',
    exercised:   false,
    notes:       '',
  })
  const [saving,  setSaving]  = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (open) setTimeout(() => setVisible(true), 10)
    else setVisible(false)
  }, [open])

  const handleClose = () => {
    setVisible(false)
    setTimeout(() => onOpenChange(false), 300)
  }

  const handleSubmit = async () => {
    setSaving(true)
    try {
      await onSubmit?.(data)
      handleClose()
    } finally {
      setSaving(false)
    }
  }

  if (!open) return null

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric'
  })

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center px-4 transition-all duration-300 ${
        visible ? 'bg-black/40 backdrop-blur-sm' : 'bg-black/0'
      }`}
      onClick={handleClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        className={`relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden
          transition-all duration-300 ease-out
          ${visible ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-6'}`}
      >
        {/* ── Top gradient bar — project colors ── */}
        <div className="h-1.5 w-full bg-linear-to-r from-[#065F46] via-emerald-500 to-teal-400" />

        {/* ── Header ── */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Today's Check-up</h2>
            <p className="text-xs text-gray-400 mt-0.5">{today}</p>
          </div>
          <button
            onClick={handleClose}
            className="p-1.5 rounded-full text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="px-6 pb-6 pt-5 space-y-4 max-h-[72vh] overflow-y-auto">

          {/* Water Intake */}
          <div className="bg-[#F0FDF4] border border-emerald-100 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-emerald-100 rounded-lg">
                  <Droplets size={15} className="text-[#065F46]" />
                </div>
                <span className="text-sm font-semibold text-gray-700">Water Intake</span>
              </div>
              <span className="text-sm font-bold text-[#065F46]">{data.waterIntake} glasses</span>
            </div>
            <input
              type="range" min={0} max={15} step={1}
              value={data.waterIntake}
              onChange={e => setData({ ...data, waterIntake: +e.target.value })}
              style={{ accentColor: '#065F46' }}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1.5">
              <span>0</span><span>8 (goal)</span><span>15</span>
            </div>
          </div>

          {/* Sleep Hours */}
          <div className="bg-[#F0FDF4] border border-emerald-100 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-emerald-100 rounded-lg">
                  <Moon size={15} className="text-[#065F46]" />
                </div>
                <span className="text-sm font-semibold text-gray-700">Sleep Hours</span>
              </div>
              <span className="text-sm font-bold text-[#065F46]">{data.sleepHours}h</span>
            </div>
            <input
              type="range" min={0} max={12} step={0.5}
              value={data.sleepHours}
              onChange={e => setData({ ...data, sleepHours: +e.target.value })}
              style={{ accentColor: '#065F46' }}
              className="w-full h-2 rounded-full appearance-none cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-gray-400 mt-1.5">
              <span>0</span><span>8 (goal)</span><span>12h</span>
            </div>
          </div>

          {/* Mood */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">How are you feeling?</p>
            <div className="grid grid-cols-4 gap-2">
              {MOODS.map(m => (
                <button
                  key={m.value}
                  onClick={() => setData({ ...data, feeling: m.value })}
                  className={`flex flex-col items-center gap-1.5 py-3 rounded-2xl border-2 text-xs font-semibold transition-all duration-200 ${
                    data.feeling === m.value
                      ? m.active + ' shadow-sm scale-105'
                      : 'border-gray-100 bg-gray-50 text-gray-500 hover:border-emerald-200 hover:bg-emerald-50'
                  }`}
                >
                  <span className="text-xl">{m.emoji}</span>
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Exercise Toggle */}
          <button
            onClick={() => setData({ ...data, exercised: !data.exercised })}
            className={`w-full flex items-center justify-between p-4 rounded-2xl border-2 transition-all duration-200 ${
              data.exercised
                ? 'bg-[#F0FDF4] border-[#065F46] text-[#065F46]'
                : 'bg-gray-50 border-gray-100 text-gray-500 hover:border-emerald-200 hover:bg-emerald-50/50'
            }`}
          >
            <div className="flex items-center gap-2">
              <div className={`p-1.5 rounded-lg transition-colors ${
                data.exercised ? 'bg-emerald-100' : 'bg-gray-100'
              }`}>
                <Dumbbell size={15} className={data.exercised ? 'text-[#065F46]' : 'text-gray-400'} />
              </div>
              <span className="text-sm font-semibold">Exercised today?</span>
            </div>
            {/* Toggle switch */}
            <div className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
              data.exercised ? 'bg-[#065F46]' : 'bg-gray-300'
            }`}>
              <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${
                data.exercised ? 'left-6' : 'left-1'
              }`} />
            </div>
          </button>

          {/* Notes */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <StickyNote size={14} className="text-gray-400" />
              <span className="text-sm font-semibold text-gray-700">Notes (Optional)</span>
            </div>
            <textarea
              value={data.notes}
              onChange={e => setData({ ...data, notes: e.target.value })}
              placeholder="Any notes about today's meals, symptoms, or feelings..."
              rows={3}
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-[#065F46] focus:ring-2 focus:ring-emerald-100 resize-none bg-gray-50 focus:bg-white transition-all"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <button
              onClick={handleClose}
              className="flex-1 py-3 border-2 border-gray-200 rounded-2xl text-sm font-semibold text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="flex-1 py-3 bg-[#065F46] hover:bg-emerald-800 text-white rounded-2xl text-sm font-bold transition-all disabled:opacity-60 flex items-center justify-center gap-2 shadow-sm shadow-emerald-900/20"
            >
              {saving
                ? <><Loader2 size={15} className="animate-spin" /> Saving...</>
                : <><Save size={15} /> Save Check-up</>
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}