// components/PatientDashboard/DailyRituals.tsx

import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { mockRituals, type Ritual } from './mockPatientDashboard';

const DailyRituals: React.FC = () => {
  const [rituals, setRituals] = useState<Ritual[]>(mockRituals);

  const toggle = (id: string) => {
    setRituals(prev =>
      prev.map(r => r.id === id ? { ...r, completed: !r.completed } : r)
    );
  };

  const doneCount = rituals.filter(r => r.completed).length;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-bold text-gray-800">Daily Rituals</h3>
        <span className="text-xs font-bold text-gray-400">{doneCount}/{rituals.length} DONE</span>
      </div>

      <div className="flex flex-col gap-2">
        {rituals.map((ritual) => (
          <button
            key={ritual.id}
            onClick={() => toggle(ritual.id)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
              ritual.completed ? 'bg-green-50' : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 border transition-colors ${
              ritual.completed ? 'bg-[#065F46] border-[#065F46]' : 'border-gray-300'
            }`}>
              {ritual.completed && <Check className="w-3 h-3 text-white" />}
            </span>
            <span className={`text-sm ${ritual.completed ? 'text-green-700 font-medium' : 'text-gray-600'}`}>
              {ritual.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DailyRituals;