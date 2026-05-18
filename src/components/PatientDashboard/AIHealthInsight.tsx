// components/PatientDashboard/AIHealthInsight.tsx

import React, { useState } from 'react';
import { Lightbulb } from 'lucide-react';

const AIHealthInsight: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  return (
    <div className="bg-[#065F46] rounded-2xl p-4 flex items-start gap-4 mb-5">
      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center shrink-0">
        <Lightbulb className="w-4 h-4 text-white" />
      </div>
      <div className="flex-1">
        <div className="text-sm font-bold text-white mb-1">AI Health Insight</div>
        <p className="text-xs text-white/80 leading-relaxed">
          Sarah, your hydration levels were lower than average yesterday. Drinking a glass of water
          before your oatmeal this morning will jumpstart your metabolism by 24%.
        </p>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="bg-white text-[#065F46] text-xs font-bold px-4 py-2 rounded-xl shrink-0 hover:bg-white/90 transition-colors"
      >
        Got it
      </button>
    </div>
  );
};

export default AIHealthInsight;