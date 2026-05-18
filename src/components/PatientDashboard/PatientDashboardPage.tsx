// pages/PatientDashboardPage.tsx

import React from 'react';
import GreetingHeader from '@/components/PatientDashboard/GreetingHeader';
import AIHealthInsight from '@/components/PatientDashboard/AIHealthInsight';
import WeightManagement from '@/components/PatientDashboard/WeightManagement';
import DailyNutrition from '@/components/PatientDashboard/DailyNutrition';
import DailyRituals from '@/components/PatientDashboard/DailyRituals';
import TodaysNourishment from '@/components/PatientDashboard/TodaysNourishment';

const PatientDashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">

      {/* Greeting */}
      <GreetingHeader />

      {/* AI Insight */}
      <AIHealthInsight />

      {/* Weight + Nutrition — جنب بعض على desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <WeightManagement />
        <DailyNutrition />
      </div>

      {/* Rituals + Nourishment — جنب بعض على desktop */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DailyRituals />
        <TodaysNourishment />
      </div>

    </div>
  );
};

export default PatientDashboardPage;