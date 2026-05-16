import React from 'react';
import { Calendar } from 'lucide-react';

type SlotType = 'available' | 'break' | 'blocked' | 'unavailable';

interface TimeSlot {
  time: string;
  type: SlotType;
}

const slotStyle: Record<SlotType, string> = {
  available:   'bg-[#065F46]/10 text-[#065F46]',
  break:       'bg-gray-100 text-gray-400',
  blocked:     'bg-red-50 text-red-400',
  unavailable: 'bg-gray-50 text-gray-300',
};

const schedule: Record<string, TimeSlot[]> = {
  MON: [
    { time: '09:00 AM - 12:00 PM', type: 'available' },
    { time: '12:00 PM - 01:00 PM', type: 'break' },
    { time: '01:00 PM - 03:00 PM', type: 'available' },
  ],
  TUE: [
    { time: '05:00 AM - 01:00 PM', type: 'available' },
    { time: 'Out of Office',       type: 'unavailable' },
  ],
  WED: [
    { time: '09:00 AM - 12:00 PM', type: 'available' },
    { time: '01:00 PM - 05:00 PM', type: 'available' },
  ],
  THU: [
    { time: '12:00 AM - 02:00 PM', type: 'available' },
    { time: 'Surgery Block',       type: 'blocked' },
  ],
  FRI: [
    { time: '08:00 AM - 12:00 PM', type: 'available' },
    { time: 'Half Day',            type: 'unavailable' },
  ],
};

const AvailabilitySchedule: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
        <h2 className="flex items-center gap-2 text-sm font-bold text-gray-800">
          <Calendar className="w-4 h-4 text-[#065F46]" />
          Availability & Schedule
        </h2>
        <div className="flex items-center gap-3 text-[10px] text-gray-400">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#065F46] block" />
            Available
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-gray-300 block" />
            Unavailable
          </span>
          <button className="text-[#065F46] font-semibold ml-2">Manage Slots</button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="flex gap-3 min-w-[580px]">
          {Object.entries(schedule).map(([day, slots]) => (
            <div key={day} className="flex-1">

              <div className="text-[10px] font-bold text-gray-400 uppercase text-center mb-2">
                {day}
              </div>

              <div className="flex flex-col gap-1.5">
                {slots.map((slot, i) => (
                  <div
                    key={i}
                    className={`text-[10px] text-center px-2 py-1.5 rounded-lg font-medium ${slotStyle[slot.type]}`}
                  >
                    {slot.time}
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default AvailabilitySchedule;