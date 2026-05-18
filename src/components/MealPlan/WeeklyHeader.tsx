import React from 'react';
import { weekDays } from './mockMealPlan';

interface WeeklyHeaderProps {
  view: 'weekly' | 'daily';
  setView: (view: 'weekly' | 'daily') => void;
  activeDay: number;
  setActiveDay: (day: number) => void;
}

const WeeklyHeader: React.FC<WeeklyHeaderProps> = ({ view, setView, activeDay, setActiveDay }) => {
  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-800">Weekly Meal Plan</h1>
          <p className="text-xs text-gray-400 mt-0.5">Personalized Nutrition Strategy: Week 12</p>
        </div>
        <div className="flex bg-gray-100 rounded-xl p-1 self-start">
          <button
            onClick={() => setView('weekly')}
            className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
              view === 'weekly' ? 'bg-[#065F46] text-white' : 'text-gray-500'
            }`}
          >
            Weekly View
          </button>
          <button
            onClick={() => setView('daily')}
            className={`px-4 py-1.5 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
              view === 'daily' ? 'bg-[#065F46] text-white' : 'text-gray-500'
            }`}
          >
            Daily Log
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {weekDays.map((d, i) => (
          <button
            key={d.day}
            onClick={() => setActiveDay(i)}
            className={`flex flex-col items-center px-4 py-2 rounded-2xl min-w-15 transition-colors cursor-pointer ${
              activeDay === i ? 'bg-[#065F46] text-white' : 'text-gray-400 hover:bg-gray-100'
            }`}
          >
            <span className="text-[10px] font-semibold uppercase">{d.day}</span>
            <span className="text-lg font-bold">{d.date}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default WeeklyHeader;