// تاب الـ Notes — ملاحظات الدكتور على المريض
import { useState } from "react"
import { usePatients } from "@/store/patientsStore"
import type { PatientNote } from "@/store/patientsStore"
import { Plus, Trash2, StickyNote } from "lucide-react"

export default function NotesTab() {
  const { patients, selectedId, updatePatient } = usePatients()
  const patient = patients.find(p => p.id === selectedId) ?? patients[0]

  const [text, setText] = useState("")

  const addNote = () => {
    if (!text.trim()) return
    const note: PatientNote = {
      id:        `n${Date.now()}`,
      text:      text.trim(),
      createdAt: new Date().toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }),
      author:    "Dr. Aris"
    }
    updatePatient(patient.id, { notes: [note, ...(patient.notes || [])] })
    setText("")
  }

  const deleteNote = (id: string) =>
    updatePatient(patient.id, { notes: patient.notes.filter(n => n.id !== id) })

  return (
    <div className="flex flex-col gap-4">
      {/* Add Note */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-3">Add Note</h3>
        <textarea value={text} onChange={e => setText(e.target.value)}
          placeholder="Write your clinical note here — food observations, patient feedback, recommendations..."
          rows={4}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-green-400 resize-none mb-3" />
        <button onClick={addNote}
          className="flex items-center gap-2 bg-green-700 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-green-800 transition-colors">
          <Plus size={15} /> Add Note
        </button>
      </div>

      {/* Notes List */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">Clinical Notes ({patient.notes?.length ?? 0})</h3>
        {patient.notes?.length === 0 ? (
          <div className="flex flex-col items-center py-10 text-gray-300">
            <StickyNote size={36} className="mb-2" />
            <p className="text-sm">No notes yet</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {patient.notes.map(note => (
              <div key={note.id} className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <div className="text-xs text-gray-400">
                    <span className="font-semibold text-gray-600">{note.author}</span>
                    {" · "}{note.createdAt}
                  </div>
                  <button onClick={() => deleteNote(note.id)}
                    className="text-gray-300 hover:text-red-400 transition-colors flex-shrink-0">
                    <Trash2 size={13} />
                  </button>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">{note.text}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}