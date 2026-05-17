import React from "react"
import type { Patient } from "../types"

const mockPatients: Patient[] = [
  {
    id: "#PT-9221",
    name: "nour ahmed",
    lastCheckIn: "Oct 24, 10:45 AM",
    planStatus: "active",
    compliance: 95,
  },
  {
    id: "#PT-9805",
    name: "manar rabie",
    lastCheckIn: "Oct 24, 09:15 AM",
    planStatus: "on-review",
    compliance: 93,
  },
  {
    id: "#PT-7719",
    name: "mona ahmed",
    lastCheckIn: "Oct 23, 04:30 PM",
    planStatus: "lapsed",
    compliance: 20,
  },
]

const statusConfig: Record<
  Patient["planStatus"],
  { bg: string; text: string; label: string }
> = {
  active: { bg: "bg-green-100", text: "text-green-700", label: "ACTIVE PLAN" },
  "on-review": {
    bg: "bg-yellow-100",
    text: "text-yellow-700",
    label: "ON REVIEW",
  },
  lapsed: { bg: "bg-red-100", text: "text-red-600", label: "LAPSED" },
}

const complianceBarColor = (value: number) => {
  if (value > 80) return "bg-green-500"
  if (value > 50) return "bg-orange-400"
  return "bg-red-500"
}

const RecentPatients: React.FC = () => {
  return (
    <div className="relative mt-4 rounded-xl bg-white p-4 shadow-sm md:mt-6 md:p-5">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-bold text-gray-800">Recent Patients</h3>
          <p className="mt-0.5 text-xs text-gray-400">
            Managing the most recent interactions and record updates.
          </p>
        </div>
        <button className="self-start text-sm font-semibold whitespace-nowrap text-green-700 hover:underline sm:self-auto">
          View Complete Directory →
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-145 border-collapse text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-xs text-gray-400">
              <th className="pb-2 font-medium">PATIENT NAME</th>
              <th className="pb-2 font-medium">LAST CHECK-IN</th>
              <th className="pb-2 font-medium">PLAN STATUS</th>
              <th className="pb-2 font-medium">COMPLIANCE</th>
              <th className="pb-2 font-medium">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {mockPatients.map((patient) => {
              const status = statusConfig[patient.planStatus]
              return (
                <tr
                  key={patient.id}
                  className="border-b border-gray-50 transition-colors hover:bg-gray-50"
                >
                  <td className="py-3">
                    <div className="font-semibold text-gray-800">
                      {patient.name}
                    </div>
                    <div className="text-xs text-gray-400">{patient.id}</div>
                  </td>
                  <td className="py-3 whitespace-nowrap text-gray-500">
                    {patient.lastCheckIn}
                  </td>
                  <td className="py-3">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold whitespace-nowrap ${status.bg} ${status.text}`}
                    >
                      {status.label}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-gray-200 md:w-20">
                        <div
                          className={`h-full rounded-full ${complianceBarColor(patient.compliance)}`}
                          style={{ width: `${patient.compliance}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">
                        {patient.compliance}%
                      </span>
                    </div>
                  </td>
                  <td className="cursor-pointer py-3 text-lg text-gray-400 hover:text-gray-600">
                    ⋮
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default RecentPatients
