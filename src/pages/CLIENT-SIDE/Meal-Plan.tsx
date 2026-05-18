import React, { useState } from 'react';
import WeeklyHeader from '@/components/MealPlan/WeeklyHeader';
import DailyMenu from '@/components/MealPlan/DailyMenu';
import DailyLog from '@/components/MealPlan/DailyLog';
import WeeklyAdherence from '@/components/MealPlan/WeeklyAdherence';
import CalorieTrends from '@/components/MealPlan/CalorieTrends';
import AIWellnessInsight from '@/components/MealPlan/AIWellnessInsight';
import { weekDays, weeklyMeals } from '@/components/MealPlan/mockMealPlan';

const MealPlanPage: React.FC = () => {
  const [view, setView] = useState<'weekly' | 'daily'>('weekly');
  const [activeDay, setActiveDay] = useState(0);

  // بنجيب اسم اليوم من الـ index
  const activeDayKey = weekDays[activeDay].day;

  // بنجيب وجبات اليوم ده
  const activeMeals = weeklyMeals[activeDayKey];

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <WeeklyHeader
        view={view}
        setView={setView}
        activeDay={activeDay}
        setActiveDay={setActiveDay}
      />

      <div className="flex flex-col lg:flex-row gap-5">
        <div className="flex-1">
          {view === 'weekly'
            ? <DailyMenu meals={activeMeals} dayName={activeDayKey} />
            : <DailyLog meals={activeMeals} dayName={activeDayKey} />
          }
        </div>
        <div className="w-full lg:w-72 shrink-0">
          <WeeklyAdherence />
          <CalorieTrends />
          <AIWellnessInsight />
        </div>
      </div>
    </div>
  );
};

export default MealPlanPage;