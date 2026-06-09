import { useState } from "react"
import { Plus, Trash2, StickyNote, Loader2, Pencil, Check, X } from "lucide-react"
import { patientService } from "@/services/api"

export default function NotesTab({ patientId, patientData, onUpdate }: {
  patientId:   string
  patientData: any
  onUpdate:    (updated: any) => void
}) {
  const [text, setText]             = useState("")
  const [isSaving, setIsSaving]     = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [error, setError]           = useState("")

  // Edit state
  const [editingId, setEditingId]   = useState<string | null>(null)
  const [editText, setEditText]     = useState("")
  const [isEditing, setIsEditing]   = useState(false)

  const notes: any[] = patientData?.notes || []

  const addNote = async () => {
    if (!text.trim()) return
    setIsSaving(true)
    setError("")
    try {
      const res = await patientService.addNote(patientId, text.trim())
      onUpdate({ ...patientData, notes: res.data.notes })
      setText("")
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to save note")
    } finally {
      setIsSaving(false)
    }
  }

  const deleteNote = async (noteId: string) => {
    setDeletingId(noteId)
    try {
      const res = await patientService.deleteNote(patientId, noteId)
      onUpdate({ ...patientData, notes: res.data.notes })
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to delete note")
    } finally {
      setDeletingId(null)
    }
  }

  const startEdit = (note: any) => {
    setEditingId(note.id)
    setEditText(note.text)
    setError("")
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditText("")
  }

  const saveEdit = async (noteId: string) => {
    if (!editText.trim()) return
    setIsEditing(true)
    setError("")
    try {
      const res = await patientService.editNote(patientId, noteId, editText.trim())
      onUpdate({ ...patientData, notes: res.data.notes })
      setEditingId(null)
      setEditText("")
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update note")
    } finally {
      setIsEditing(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 w-full">

      {/* Add Note */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-1">Add Clinical Note</h3>
        <p className="text-xs text-gray-400 mb-3">
          Notes are saved to the patient's record and visible only to you.
        </p>

        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Write your clinical note — food observations, patient feedback, recommendations..."
          rows={4}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-green-400 resize-none mb-3"
        />

        {error && <p className="text-xs text-red-500 mb-2">{error}</p>}

        <button
          onClick={addNote}
          disabled={isSaving || !text.trim()}
          className="flex items-center gap-2 bg-green-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-green-800 transition-colors disabled:opacity-50"
        >
          {isSaving
            ? <><Loader2 size={14} className="animate-spin" /> Saving...</>
            : <><Plus size={14} /> Add Note</>
          }
        </button>
      </div>

      {/* Notes List */}
      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h3 className="font-bold text-gray-800 mb-4">
          Clinical Notes
          <span className="ml-2 text-xs font-normal text-gray-400">({notes.length})</span>
        </h3>

        {notes.length === 0 ? (
          <div className="flex flex-col items-center py-10 text-gray-300">
            <StickyNote size={36} className="mb-2" />
            <p className="text-sm">No notes yet</p>
            <p className="text-xs mt-1">Add your first clinical note above</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {notes.map((note: any) => (
              <div key={note.id}
                className="border border-gray-100 rounded-xl p-4 hover:border-gray-200 transition-colors">
                <div className="flex justify-between items-start gap-2 mb-2">
                  <div className="text-xs text-gray-400">
                    <span className="font-semibold text-gray-600">{note.author}</span>
                    {" · "}{note.createdAt}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {/* Edit Button */}
                    {editingId !== note.id && (
                      <button
                        onClick={() => startEdit(note)}
                        className="text-gray-300 hover:text-green-600 transition-colors"
                        title="Edit note"
                      >
                        <Pencil size={13} />
                      </button>
                    )}
                    {/* Delete Button */}
                    <button
                      onClick={() => deleteNote(note.id)}
                      disabled={deletingId === note.id || editingId === note.id}
                      className="text-gray-300 hover:text-red-400 transition-colors disabled:opacity-30"
                      title="Delete note"
                    >
                      {deletingId === note.id
                        ? <Loader2 size={13} className="animate-spin" />
                        : <Trash2 size={13} />
                      }
                    </button>
                  </div>
                </div>

                {/* Edit Mode */}
                {editingId === note.id ? (
                  <div className="flex flex-col gap-2 mt-1">
                    <textarea
                      value={editText}
                      onChange={e => setEditText(e.target.value)}
                      rows={3}
                      autoFocus
                      className="w-full border border-green-300 rounded-xl px-3 py-2 text-sm outline-none focus:border-green-500 resize-none bg-green-50"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEdit(note.id)}
                        disabled={isEditing || !editText.trim()}
                        className="flex items-center gap-1.5 bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-green-800 transition-colors disabled:opacity-50"
                      >
                        {isEditing
                          ? <><Loader2 size={11} className="animate-spin" /> Saving...</>
                          : <><Check size={11} /> Save</>
                        }
                      </button>
                      <button
                        onClick={cancelEdit}
                        disabled={isEditing}
                        className="flex items-center gap-1.5 border border-gray-200 text-gray-500 px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-colors"
                      >
                        <X size={11} /> Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-700 leading-relaxed">{note.text}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}