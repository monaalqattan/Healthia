// components/PatientDashboard/WeightManagement.tsx

import React from 'react';
import { TrendingDown } from 'lucide-react';

const WeightManagement: React.FC = () => {
  const percentage = 65;
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">

      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-base font-bold text-gray-800">Weight Management</h3>
          <p className="text-xs text-gray-400 mt-0.5">Targeting 'Lose 5 kg' by Dec 15</p>
        </div>
        <span className="text-xs font-bold bg-green-100 text-green-700 px-3 py-1 rounded-full">
          65% COMPLETE
        </span>
      </div>

      {/* المحتوى */}
      <div className="flex items-center gap-6 mb-4">

        {/* الدايرة */}
        <svg width="100" height="100" viewBox="0 0 100 100" className="shrink-0">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="#f3f4f6" strokeWidth="8" />
          <circle
            cx="50" cy="50" r={radius}
            fill="none" stroke="#065F46" strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 50 50)"
          />
          <text x="50" y="52" textAnchor="middle" style={{ fontSize: '14px', fontWeight: 'bold', fill: '#065F46' }}>
            {percentage}%
          </text>
          <text x="50" y="64" textAnchor="middle" style={{ fontSize: '7px', fill: '#9ca3af' }}>
            PROGRESS
          </text>
        </svg>

        {/* الأرقام */}
        <div className="flex flex-col gap-3 flex-1">
          <div className="bg-gray-50 rounded-xl px-4 py-2">
            <div className="text-[10px] text-gray-400 uppercase tracking-wide">Current</div>
            <div className="text-lg font-bold text-gray-800">68.5 kg</div>
          </div>
          <div className="bg-gray-50 rounded-xl px-4 py-2">
            <div className="text-[10px] text-gray-400 uppercase tracking-wide">Target</div>
            <div className="text-lg font-bold text-gray-800">65.0 kg</div>
          </div>
        </div>

        {/* التغيير */}
        <div className="text-center shrink-0">
          <TrendingDown className="w-5 h-5 text-green-500 mx-auto mb-1" />
          <div className="text-sm font-bold text-green-600">-1.2 kg</div>
          <div className="text-[10px] text-gray-400">Since last week</div>
        </div>
      </div>

      {/* الجراف الصغير */}
      <div className="bg-gray-50 rounded-xl p-3">
        <div className="text-[10px] text-gray-400 mb-2 uppercase tracking-wide">30-Day Weight History</div>
        <div className="h-12 flex items-end gap-1">
          {[68.5, 69.1, 69.8, 70.2, 69.9, 69.5, 69.0, 68.8, 68.5].map((w, i) => (
            <div
              key={i}
              className="flex-1 bg-[#065F46]/20 rounded-sm"
              style={{ height: `${((w - 67) / 4) * 100}%` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default WeightManagement;