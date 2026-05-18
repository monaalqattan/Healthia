// components/MealPlan/AIWellnessInsight.tsx

import React from 'react';
import { Sparkles } from 'lucide-react';

const AIWellnessInsight: React.FC = () => {
  return (
    <div className="bg-[#065F46] rounded-2xl p-5 text-white">
      <h3 className="flex items-center gap-2 text-sm font-bold mb-3">
        <Sparkles className="w-4 h-4" />
        AI Wellness Insight
      </h3>
      <p className="text-xs leading-relaxed text-white/80 mb-4">
        "Your fiber intake is up by 15% this week! This aligns perfectly with your recovery goals.
        Try adding roasted chickpeas to your Friday snack for an extra protein boost while maintaining this momentum."
      </p>
      <button className="w-full bg-white text-[#065F46] text-sm font-semibold py-2.5 rounded-xl hover:bg-white/90 transition-colors">
        Adjust Plan for Next Week
      </button>
    </div>
  );
};

export default AIWellnessInsight;