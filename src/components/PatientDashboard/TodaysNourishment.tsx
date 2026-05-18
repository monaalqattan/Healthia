// components/PatientDashboard/TodaysNourishment.tsx

import React, { useState } from 'react';
import { Utensils, RefreshCw } from 'lucide-react';
import { mockMeals, type NourishmentMeal } from './mockPatientDashboard';

const mealTypeColor: Record<NourishmentMeal['type'], string> = {
  BREAKFAST: 'text-green-600 bg-green-50',
  LUNCH:     'text-blue-600 bg-blue-50',
  DINNER:    'text-orange-600 bg-orange-50',
  SNACKS:    'text-purple-600 bg-purple-50',
};

const TodaysNourishment: React.FC = () => {
  const [meals, setMeals] = useState<NourishmentMeal[]>(mockMeals);

  const toggleMeal = (id: string) => {
    setMeals(prev =>
      prev.map(m => m.id === id ? { ...m, completed: !m.completed } : m)
    );
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base font-bold text-gray-800">Today's Nourishment</h3>
        <button className="text-[#065F46] text-xs font-semibold hover:underline">
          Full Weekly Plan →
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {meals.map((meal) => (
          <div key={meal.id} className="border border-gray-100 rounded-2xl overflow-hidden">

            {/* صورة */}
            <div className="h-28 bg-gray-100 relative flex items-center justify-center">
              <Utensils className="w-8 h-8 text-gray-300" />
              <span className={`absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full ${mealTypeColor[meal.type]}`}>
                {meal.type}
              </span>
            </div>

            {/* المحتوى */}
            <div className="p-3">
              <div className="flex justify-between items-center mb-2">
                <div className="text-sm font-semibold text-gray-800">{meal.name}</div>
                <div className="text-xs text-gray-400">{meal.calories} kcal</div>
              </div>

              <div className="flex items-center gap-2">
                {meal.completed ? (
                  <div className="flex-1 flex items-center justify-center gap-1 bg-green-50 text-green-600 text-xs font-semibold py-1.5 rounded-lg">
                    <span>✓ Logged</span>
                  </div>
                ) : (
                  <button
                    onClick={() => toggleMeal(meal.id)}
                    className="flex-1 bg-[#065F46] text-white text-xs font-semibold py-1.5 rounded-lg hover:bg-[#054d38] transition-colors"
                  >
                    Mark Completed
                  </button>
                )}
                <button className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <RefreshCw className="w-3 h-3 text-gray-400" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodaysNourishment;