// components/MealPlan/MealCard.tsx

import React from 'react';
import { Check, Pencil } from 'lucide-react';
import type { Meal } from './mockMealPlan';

const mealTypeColor: Record<Meal['type'], string> = {
  BREAKFAST: 'text-green-600 bg-green-50',
  LUNCH:     'text-blue-600 bg-blue-50',
  DINNER:    'text-orange-600 bg-orange-50',
};

const MacroItem: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div>
    <div className="text-[9px] text-gray-400 uppercase tracking-wide">{label}</div>
    <div className="text-xs font-bold text-gray-700">{value}</div>
  </div>
);

const MealCard: React.FC<{ meal: Meal }> = ({ meal }) => {
  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm flex gap-4 mb-3">

      {/* الصورة */}
      <div className="w-24 h-24 rounded-xl bg-gray-100 shrink-0 overflow-hidden">
        <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200" />
      </div>

      {/* المحتوى */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${mealTypeColor[meal.type]}`}>
            {meal.type}
          </span>
          <span className="text-xs text-gray-400">{meal.time}</span>
        </div>

        <h3 className="text-sm font-bold text-gray-800 mb-1">{meal.name}</h3>
        <p className="text-xs text-gray-400 mb-3 leading-relaxed">{meal.description}</p>

        {/* Macros + Actions */}
        <div className="flex justify-between items-center">
          <div className="flex gap-4">
            <MacroItem label="Calories" value={`${meal.calories} kcal`} />
            <MacroItem label="Protein"  value={`${meal.protein}g`} />
            <MacroItem label="Carbs"    value={`${meal.carbs}g`} />
            <MacroItem label="Fats"     value={`${meal.fats}g`} />
          </div>

          {/* الأزرار */}
          <div className="flex flex-col gap-1 shrink-0">
            <button className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
              meal.completed
                ? 'bg-[#065F46] text-white'
                : 'border border-gray-200 text-gray-300 hover:border-[#065F46]'
            }`}>
              <Check className="w-3.5 h-3.5" />
            </button>
            {/* <button className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors">
              <Pencil className="w-3 h-3 text-gray-400" />
            </button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealCard;