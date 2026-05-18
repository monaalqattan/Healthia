import React from 'react';
import { Check, Pencil } from 'lucide-react';
import type { Meal } from './mockMealPlan';

interface DailyLogProps {
  meals: Meal[];
  dayName: string;
}

const DailyLog: React.FC<DailyLogProps> = ({ meals, dayName }) => {
  const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);
  const totalProtein  = meals.reduce((sum, m) => sum + m.protein, 0);
  const totalCarbs    = meals.reduce((sum, m) => sum + m.carbs, 0);
  const totalFats     = meals.reduce((sum, m) => sum + m.fats, 0);

  return (
    <div className="flex-1">
      <h2 className="text-base font-bold text-gray-800 mb-4">Daily Log — {dayName}</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
        <div className="bg-white rounded-xl p-3 shadow-sm text-center">
          <div className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Total Calories</div>
          <div className="text-xl font-bold text-[#065F46]">{totalCalories}</div>
          <div className="text-[10px] text-gray-400">of 1,690 kcal</div>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm text-center">
          <div className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Protein</div>
          <div className="text-xl font-bold text-blue-500">{totalProtein}g</div>
          <div className="text-[10px] text-gray-400">of 120g</div>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm text-center">
          <div className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Carbs</div>
          <div className="text-xl font-bold text-orange-400">{totalCarbs}g</div>
          <div className="text-[10px] text-gray-400">of 200g</div>
        </div>
        <div className="bg-white rounded-xl p-3 shadow-sm text-center">
          <div className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">Fats</div>
          <div className="text-xl font-bold text-yellow-500">{totalFats}g</div>
          <div className="text-[10px] text-gray-400">of 65g</div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-125">
            <thead>
              <tr className="text-left text-[10px] text-gray-400 uppercase tracking-wide border-b border-gray-100">
                <th className="px-4 py-3 font-medium">Meal</th>
                <th className="px-4 py-3 font-medium">Time</th>
                <th className="px-4 py-3 font-medium">Calories</th>
                <th className="px-4 py-3 font-medium">Protein</th>
                <th className="px-4 py-3 font-medium">Carbs</th>
                <th className="px-4 py-3 font-medium">Fats</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {meals.map((meal) => (
                <tr key={meal.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-semibold text-gray-800 text-xs">{meal.name}</div>
                    <div className="text-[10px] text-gray-400">{meal.type}</div>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">{meal.time}</td>
                  <td className="px-4 py-3 text-xs font-semibold text-gray-700">{meal.calories} kcal</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{meal.protein}g</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{meal.carbs}g</td>
                  <td className="px-4 py-3 text-xs text-gray-600">{meal.fats}g</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        meal.completed ? 'bg-[#065F46] text-white' : 'border border-gray-200'
                      }`}>
                        <Check className="w-3 h-3" />
                      </span>
                      <Pencil className="w-3 h-3 text-gray-300 cursor-pointer hover:text-gray-500" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DailyLog;