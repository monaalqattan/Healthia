import type { ColumnDef } from "@tanstack/react-table"
// import { useNavigate } from "react-router"
import { Eye, Trash2, MoreVertical } from "lucide-react"
import { useState } from "react"
import type { PatientRecord, PlanStatus } from "@/store/patientsStore"

const statusConfig: Record<PlanStatus, { bg: string; text: string; dot: string; label: string }> = {
  active:      { bg: "bg-green-50",  text: "text-green-700",  dot: "bg-green-500",  label: "ACTIVE PLAN" },
  "on-review": { bg: "bg-yellow-50", text: "text-yellow-700", dot: "bg-yellow-400", label: "ON REVIEW"   },
  lapsed:      { bg: "bg-red-50",    text: "text-red-500",    dot: "bg-red-400",    label: "LAPSED"       },
}

const complianceColor = (v: number) =>
  v > 80 ? "bg-green-600" : v > 50 ? "bg-yellow-400" : "bg-red-400"

// Actions cell — component منفصل عشان يستخدم hooks
function ActionsCell({
  patient,
  onDelete,
  onNavigate,
}: {
  patient: PatientRecord
  onDelete: (id: string) => void
  onNavigate: (id: string) => void
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative" onClick={e => e.stopPropagation()}>
      <button
        onClick={() => setOpen(p => !p)}
        className="p-1 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <MoreVertical size={16} />
      </button>
      {open && (
        <div className="absolute right-0 top-8 bg-white border border-gray-100 rounded-xl shadow-lg z-20 py-1 w-40"
          onMouseLeave={() => setOpen(false)}>
          <button onClick={() => { onNavigate(patient.id); setOpen(false) }}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50">
            <Eye size={13} /> View Profile
          </button>
          <div className="border-t border-gray-100 my-1" />
          <button onClick={() => { onDelete(patient.id); setOpen(false) }}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50">
            <Trash2 size={13} /> Delete
          </button>
        </div>
      )}
    </div>
  )
}

// Factory function — بتاخد callbacks وبترجع الـ columns
export function createColumns(
  onNavigate: (id: string) => void,
  onDelete:   (id: string) => void,
): ColumnDef<PatientRecord>[] {
  return [
    {
      accessorKey: "name",
      header: "PATIENT NAME",
      cell: ({ row }) => {
        const p = row.original
        return (
          <div className="flex items-center gap-3">
            <img
              src={p.avatar || `https://i.pravatar.cc/150?u=${p.id}`}
              alt={p.name}
              className="w-8 h-8 rounded-full object-cover flex-shrink-0"
            />
            <div>
              <div className="font-semibold text-gray-800 text-sm">{p.name}</div>
              <div className="text-xs text-gray-400">{p.id}</div>
            </div>
          </div>
        )
      },
    },
    {
      accessorKey: "lastCheckIn",
      header: "LAST CHECK-IN",
      cell: ({ getValue }) => (
        <span className="text-gray-500 text-sm whitespace-nowrap">{getValue() as string}</span>
      ),
    },
    {
      accessorKey: "planStatus",
      header: "PLAN STATUS",
      cell: ({ getValue }) => {
        const s = statusConfig[getValue() as PlanStatus]
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
      cell: ({ getValue }) => {
        const v = getValue() as number
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