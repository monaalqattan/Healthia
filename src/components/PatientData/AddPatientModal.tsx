import { useState } from "react"

type Props = {
  open: boolean
  onClose: () => void
}

export function AddPatientModal({ open, onClose }: Props) {
  const [clientType, setClientType] = useState<"Online" | "Offline">("Online")

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-xl">
        {/* Header */}
        <div className="mb-7 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-green-900">
              Add New Patient
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Register a new profile to start tracking vitality data.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-xl text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <div className="grid grid-cols-2 gap-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
              Full Name
            </label>
            <input
              className="h-11 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm"
              placeholder="e.g. Sarah Jenkins"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
              Patient ID
            </label>
            <input
              className="h-11 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm"
              placeholder="VITA-2024-001"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
              Phone Number
            </label>
            <input
              className="h-11 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm"
              placeholder="+1 (555) 000-0000"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
              Email Address
            </label>
            <input
              className="h-11 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm"
              placeholder="sarah.j@example.com"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
              Client Type
            </label>
            <div className="flex h-11 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
              {(["Online", "Offline"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setClientType(t)}
                  className={`flex-1 text-sm font-medium transition-all ${
                    clientType === t
                      ? "m-1 rounded-md bg-white text-green-800 shadow-sm"
                      : "text-gray-400"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
              Category
            </label>
            <select className="h-11 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm">
              <option>Nutrition &amp; Wellness</option>
              <option>Physical Therapy</option>
              <option>Mental Health</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
              Period
            </label>
            <select className="h-11 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm">
              <option>3 Months Program</option>
              <option>6 Months Program</option>
              <option>1 Year Program</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
              Start Date
            </label>
            <input
              type="date"
              className="h-11 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
              Payment Method
            </label>
            <select className="h-11 rounded-lg border border-gray-200 bg-gray-50 px-3 text-sm">
              <option>Credit/Debit Card</option>
              <option>Bank Transfer</option>
              <option>Cash</option>
            </select>
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-widest text-gray-500 uppercase">
              Initial Payment Amount
            </label>
            <div className="relative">
              <span className="absolute top-1/2 left-3 -translate-y-1/2 text-sm text-gray-400">
                $
              </span>
              <input
                type="number"
                className="h-11 w-full rounded-lg border border-gray-200 bg-gray-50 pr-3 pl-6 text-sm"
                placeholder="0.00"
              />
            </div>
          </div>
        </div>

        <hr className="my-5 border-gray-100" />

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2.5 text-sm font-medium text-green-800"
          >
            Cancel
          </button>
          <button className="rounded-lg bg-green-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-green-800">
            Create Profile
          </button>
        </div>
      </div>
    </div>
  )
}
