import type { ColumnDef } from "@tanstack/react-table"
import { Eye, Trash2, MoreVertical } from "lucide-react"
import { useState } from "react"

// بنستغنى عن PatientRecord من patientsStore ونستخدم any عشان الـ API data
type PlanStatus = "active" | "on-review" | "lapsed"

const statusConfig: Record<PlanStatus, { bg: string; text: string; dot: string; label: string }> = {
  active:      { bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-500",  label: "ACTIVE PLAN" },
  "on-review": { bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-400", label: "ON REVIEW"   },
  lapsed:      { bg: "bg-red-50",    text: "text-red-500",    dot: "bg-red-400",    label: "LAPSED"      },
}

// fallback لو القيمة مش موجودة
const defaultStatus = statusConfig["active"]

const complianceColor = (v: number) =>
  v > 80 ? "bg-green-600" : v > 50 ? "bg-yellow-400" : "bg-red-400"

function ActionsCell({
  patient,
  onDelete,
  onNavigate,
}: {
  patient: any
  onDelete: (id: string) => void
  onNavigate: (id: string) => void
}) {
  const [open, setOpen] = useState(false)
  // الـ API بيرجع _id، الـ mock بيرجع id
  const id = patient._id || patient.id

  return (
    <div className="relative" onClick={e => e.stopPropagation()}>
      <button
        onClick={() => setOpen(p => !p)}
        className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <MoreVertical size={16} />
      </button>
      {open && (
        <div
          className="absolute right-0 top-8 bg-white border border-gray-100 rounded-xl shadow-lg z-20 py-1 w-40"
          onMouseLeave={() => setOpen(false)}
        >
          <button
            onClick={() => { onNavigate(id); setOpen(false) }}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
          >
            <Eye size={13} /> View Profile
          </button>
          <div className="border-t border-gray-100 my-1" />
          <button
            onClick={() => { onDelete(id); setOpen(false) }}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50"
          >
            <Trash2 size={13} /> Delete
          </button>
        </div>
      )}
    </div>
  )
}

export function createColumns(
  onNavigate: (id: string) => void,
  onDelete:   (id: string) => void,
): ColumnDef<any>[] {
  return [
    {
      accessorKey: "name",
      header: "PATIENT NAME",
      cell: ({ row }) => {
        const p = row.original
        const id = p._id || p.id
        return (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center text-white text-xs font-bold shrink-0 overflow-hidden">
              {p.profileImage || p.avatar
                ? <img src={p.profileImage || p.avatar} alt={p.name} className="w-full h-full object-cover" />
                : (p.name ? p.name[0].toUpperCase() : "P")
              }
            </div>
            <div>
              <div className="font-semibold text-gray-800 text-sm">{p.name}</div>
              <div className="text-xs text-gray-400">{p.patientId || p.id || id}</div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "lastCheckIn",
      header: "LAST CHECK-IN",
      cell: ({ row }) => {
        // الـ API مش بترجع lastCheckIn — بنستخدم updatedAt
        const p = row.original
        const date = p.lastCheckIn || p.updatedAt
        const display = date
          ? new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
          : "—"
        return <span className="text-gray-500 text-sm whitespace-nowrap">{display}</span>
      },
    },
    {
      accessorKey: "planStatus",
      header: "PLAN STATUS",
      cell: ({ row }) => {
        const p = row.original
        // الـ API مش بترجع planStatus — بنستخدم clientType كـ fallback
        const rawStatus = p.planStatus as PlanStatus
        const s = statusConfig[rawStatus] || defaultStatus
        return (
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full ${s.bg} ${s.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
            {s.label}
          </span>
        )
      },
    },
    {
      accessorKey: "compliance",
      header: "COMPLIANCE",
      cell: ({ row }) => {
        const v = (row.original.compliance ?? row.original.adherence ?? 0) as number
        return (
          <div className="flex items-center gap-2">
            <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${complianceColor(v)}`} style={{ width: `${v}%` }} />
            </div>
            <span className="text-xs text-gray-600 font-medium">{v}%</span>
          </div>
        )
      },
    },
    {
      id: "actions",
      header: "ACTIONS",
      cell: ({ row }) => (
        <ActionsCell patient={row.original} onDelete={onDelete} onNavigate={onNavigate} />
      ),
    },
  ]
}