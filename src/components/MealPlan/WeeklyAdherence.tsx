// components/MealPlan/WeeklyAdherence.tsx

import React from 'react';

const WeeklyAdherence: React.FC = () => {
  const percentage = 92;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
      <h3 className="text-base font-bold text-gray-800 text-center mb-4">Weekly Adherence</h3>

      {/* الدايرة */}
      <div className="flex justify-center mb-4">
        <svg width="140" height="140" viewBox="0 0 140 140">
          {/* الدايرة الرمادية الخلفية */}
          <circle cx="70" cy="70" r={radius} fill="none" stroke="#f3f4f6" strokeWidth="10" />
          {/* الدايرة الخضرا */}
          <circle
            cx="70" cy="70" r={radius}
            fill="none"
            stroke="#065F46"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            transform="rotate(-90 70 70)"
          />
          {/* النسبة */}
          <text x="70" y="65" textAnchor="middle" className="fill-gray-800" style={{ fontSize: '22px', fontWeight: 'bold', fill: '#065F46' }}>
            {percentage}%
          </text>
          <text x="70" y="82" textAnchor="middle" style={{ fontSize: '9px', fill: '#9ca3af', letterSpacing: '1px' }}>
            ON TRACK
          </text>
        </svg>
      </div>

      <p className="text-xs text-gray-400 text-center leading-relaxed">
        You have hit your macro targets for 6 out of the last 7 days. Keep it up!
      </p>
    </div>
  );
};

export default WeeklyAdherence;