// // components/PatientData/columns.tsx
// import type { ColumnDef } from "@tanstack/react-table"
// import { MoreVertical } from "lucide-react"

// export type DataType = {
//   id: string
//   patientName: string
//   patientId: string 
//   planStatus: "Active Plan" | "On Review" | "Lapsed"
//   lastVisit: string
//   compliance: number 
//   avatar: string 
// }

// export const columns: ColumnDef<DataType>[] = [
//   {
//     accessorKey: "patientName",
//     header: "PATIENT NAME",
//     cell: ({ row }) => (
//       <div className="flex items-center gap-3">
//         <img
//           src={row.original.avatar}
//           className="h-10 w-10 rounded-full object-cover"
//           alt=""
//         />
//         <div className="flex flex-col">
//           <span className="font-bold text-gray-900">
//             {row.original.patientName}
//           </span>
//           <span className="text-xs text-gray-400 underline">
//             ID: {row.original.patientId}
//           </span>
//         </div>
//       </div>
//     ),
//   },
//   {
//     accessorKey: "lastVisit",
//     header: "LAST CHECK-IN",
//   },
//   {
//     accessorKey: "planStatus",
//     header: "PLAN STATUS",
//     cell: ({ row }) => {
//       const status = row.getValue("planStatus") as string
//       const colors = {
//         "Active Plan": "bg-green-100 text-green-700",
//         "On Review": "bg-green-50 text-green-600",
//         Lapsed: "bg-red-100 text-red-600",
//       }
//       return (
//         <div
//           className={`flex w-fit items-center gap-2 rounded-full px-3 py-1 text-[10px] font-medium uppercase ${colors[status as keyof typeof colors]}`}
//         >
//           <span
//             className={`h-1.5 w-1.5 rounded-full ${status === "Lapsed" ? "bg-red-500" : "bg-green-500"}`}
//           />
//           {status}
//         </div>
//       )
//     },
//   },
//   {
//     accessorKey: "compliance",
//     header: "COMPLIANCE",
//     cell: ({ row }) => {
//       const val = row.getValue("compliance") as number
//       return (
//         <div className="flex items-center gap-3">
//           <div className="h-1.5 w-24 overflow-hidden rounded-full bg-gray-100">
//             <div
//               className={`h-full ${val > 50 ? "bg-emerald-800" : "bg-red-600"}`}
//               style={{ width: `${val}%` }}
//             />
//           </div>
//           <span className="text-sm font-bold text-emerald-900">{val}%</span>
//         </div>
//       )
//     },
//   },
//   {
//     id: "actions",
//     header: "ACTIONS",
//     cell: () => (
//       <MoreVertical className="h-5 w-5 cursor-pointer text-gray-400" />
//     ),
//   },
// ]
