// components/MealPlan/CalorieTrends.tsx

import React from 'react';
import { mockCalorieTrends } from './mockMealPlan';

const CalorieTrends: React.FC = () => {
  const maxCalories = 2500;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
      <h3 className="text-base font-bold text-gray-800 mb-4">Daily Calorie Trends</h3>

      <div className="flex flex-col gap-3">
        {mockCalorieTrends.map((item) => {
          const isOver = item.calories > item.target;
          const barWidth = item.calories ? (item.calories / maxCalories) * 100 : 0;

          return (
            <div key={item.day} className="flex items-center gap-3">
              {/* اليوم */}
              <span className="text-xs text-gray-400 w-8">{item.day}</span>

              {/* الـ bar */}
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    item.calories === 0 ? 'bg-gray-200' :
                    isOver ? 'bg-red-400' : 'bg-[#065F46]'
                  }`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>

              {/* الرقم */}
              <span className="text-xs font-semibold text-gray-600 w-16 text-right">
                {item.calories ? item.calories.toLocaleString() : '-'}
              </span>
            </div>
          );
        })}
      </div>

      <div className="border-t border-gray-100 mt-4 pt-3 flex justify-between items-center">
        <span className="text-xs text-gray-400">Avg. Weekly Intake</span>
        <span className="text-base font-bold text-gray-800">1,980 kcal</span>
      </div>
    </div>
  );
};

export default CalorieTrends;