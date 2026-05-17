// src/components/ui/book-appointment/AddNotes.tsx

interface AddNotesProps {
  notes: string
  onNotesChange: (notes: string) => void
  onConfirm: () => void
  onCancel: () => void
  isConfirmDisabled: boolean
}

export default function AddNotes({
  notes, onNotesChange, onConfirm, onCancel, isConfirmDisabled
}: AddNotesProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm w-full">

      <p className="text-sm font-semibold text-gray-700 mb-1">Add Notes</p>
      <p className="text-xs text-gray-400 mb-3">
        Tell us about any symptoms you are experiencing or your health goals for this visit.
      </p>

      <textarea
        placeholder="Example: I've been experiencing mild chest tightness daily for my morning walks."
        value={notes}
        onChange={(e) => onNotesChange(e.target.value)}
        rows={4}
        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-xs text-gray-600 outline-none focus:border-green-500 resize-none placeholder:text-gray-300"
      />

      {/* Buttons */}
      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={onCancel}
          className="px-5 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-full transition-all cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isConfirmDisabled}
          className={`
            px-5 py-2 text-sm font-semibold rounded-full transition-all
            ${isConfirmDisabled
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-green-700 text-white hover:bg-green-800 cursor-pointer"
            }
          `}
        >
          Confirm Appointment
        </button>
      </div>
    </div>
  )
}