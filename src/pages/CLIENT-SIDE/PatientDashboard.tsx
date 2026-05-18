import React from 'react'
import GreetingHeader from '@/components/PatientDashboard/GreetingHeader'
import AIHealthInsight from '@/components/PatientDashboard/AIHealthInsight'
import WeightManagement from '@/components/PatientDashboard/WeightManagement'
import DailyNutrition from '@/components/PatientDashboard/DailyNutrition'
import DailyRituals from '@/components/PatientDashboard/DailyRituals'
import TodaysNourishment from '@/components/PatientDashboard/TodaysNourishment'
import DailyCheckupCard from '@/components/PatientDashboard/DailyCheckupCard'

const PatientDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <GreetingHeader />
      <AIHealthInsight />

      {/* Daily Check-up Banner — أول حاجة يشوفها المريض */}
      <DailyCheckupCard />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <WeightManagement />
        <DailyNutrition />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DailyRituals />
        <TodaysNourishment />
      </div>
    </div>
  )
}

export default PatientDashboard