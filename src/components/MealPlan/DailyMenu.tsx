import React from 'react';
import { Utensils } from 'lucide-react';
import MealCard from './MealCard';
import type { Meal } from './mockMealPlan';

interface DailyMenuProps {
  meals: Meal[];
  dayName: string;
}

const DailyMenu: React.FC<DailyMenuProps> = ({ meals, dayName }) => {
  const totalCalories = meals.reduce((sum, m) => sum + m.calories, 0);
  const remaining = 1690 - meals.filter(m => m.completed).reduce((sum, m) => sum + m.calories, 0);

  return (
    <div className="flex-1">
      <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
        <h2 className="flex items-center gap-2 text-base font-bold text-gray-800">
          <Utensils className="w-4 h-4 text-[#065F46]" />
          {dayName}'s Menu
        </h2>
        <div className="flex gap-4 text-xs">
          <div>
            <span className="text-gray-400">REMAINING </span>
            <span className="font-bold text-[#065F46]">{remaining} kcal</span>
          </div>
          <div>
            <span className="text-gray-400">TOTAL </span>
            <span className="font-bold text-gray-600">{totalCalories} kcal</span>
          </div>
        </div>
      </div>

      {meals.map((meal) => (
        <MealCard key={meal.id} meal={meal} />
      ))}
    </div>
  );
};

export default DailyMenu;