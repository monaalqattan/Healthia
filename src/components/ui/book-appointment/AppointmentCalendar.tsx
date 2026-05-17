// src/components/ui/book-appointment/AppointmentCalendar.tsx
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"

interface AppointmentCalendarProps {
  selectedDate: Date
  onDateChange: (date: Date) => void
}

export default function AppointmentCalendar({
  selectedDate,
  onDateChange,
}: AppointmentCalendarProps) {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm w-full appointment-calendar">
      <style>{`
        .appointment-calendar .react-calendar {
          border: none;
          width: 100%;
          font-family: inherit;
        }
        .appointment-calendar .react-calendar__navigation {
          margin-bottom: 12px;
        }
        .appointment-calendar .react-calendar__navigation button {
          font-size: 13px;
          font-weight: 600;
          color: #1f2937;
          border-radius: 8px;
          min-width: 32px;
          height: 32px;
          background: none;
        }
        .appointment-calendar .react-calendar__navigation button:hover {
          background: #f3f4f6 !important;
        }
        .appointment-calendar .react-calendar__month-view__weekdays {
          font-size: 11px;
          color: #9ca3af;
          text-transform: uppercase;
          font-weight: 600;
          margin-bottom: 4px;
        }
        .appointment-calendar .react-calendar__month-view__weekdays abbr {
          text-decoration: none;
        }
        .appointment-calendar .react-calendar__month-view__days {
          display: grid !important;
          grid-template-columns: repeat(7, 1fr);
          gap: 2px;
        }
        .appointment-calendar .react-calendar__tile {
          font-size: 12px;
          color: #374151;
          padding: 0;
          height: 36px;
          width: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          margin: 2px auto;
          background: none;
          border: none;
          cursor: pointer;
          transition: all 0.15s;
          flex: none !important;
          max-width: none !important;
        }
        .appointment-calendar .react-calendar__tile:hover:not(:disabled) {
          background: #dcfce7 !important;
          color: #15803d;
        }
        .appointment-calendar .react-calendar__tile--active {
          background: #15803d !important;
          color: white !important;
          border-radius: 50%;
        }
        .appointment-calendar .react-calendar__tile--active:hover {
          background: #166534 !important;
        }
        .appointment-calendar .react-calendar__tile--now:not(.react-calendar__tile--active) {
          background: #dcfce7 !important;
          color: #15803d;
          font-weight: bold;
          border-radius: 50%;
        }
        .appointment-calendar .react-calendar__month-view__days__day--weekend {
          color: #9ca3af;
        }
        .appointment-calendar .react-calendar__month-view__days__day--neighboringMonth {
          color: #d1d5db;
        }
        .appointment-calendar .react-calendar__tile:disabled {
          color: #e5e7eb;
          cursor: not-allowed;
          background: none !important;
        }
      `}</style>

      <Calendar
        onChange={(value) => {
          // react-calendar v6: value is Date | Date[] | null
          if (value instanceof Date) {
            onDateChange(value)
          } else if (Array.isArray(value) && value[0] instanceof Date) {
            onDateChange(value[0])
          }
        }}
        value={selectedDate}
        minDate={new Date()}
      />
    </div>
  )
}
