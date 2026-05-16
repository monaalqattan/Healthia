// Dashboard/NetworkVitalityCard.tsx

import { BadgeCheck } from 'lucide-react';
import React from 'react';

const StatBadge: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="bg-white/20 rounded-xl px-4 py-2 text-center min-w-[80px]">
    <div className="text-xl font-bold text-white">{value}</div>
    <div className="text-[10px] text-white/80 mt-1">{label}</div>
  </div>
);

const NetworkVitalityCard: React.FC = () => {
  return (
    <div className="bg-[#197E46] rounded-2xl p-6 text-white mb-6 mt-20">
      <h2 className="text-2xl font-bold mb-2 plus-jakarta">Network Vitality & Compliance</h2>
      <div className="flex justify-between items-center flex-wrap ">
        <p className="text-sm text-white/85 mb-5 w-full sm:w-5/6 md:w-4/6 lg:w-3/6">
        Your practice is currently operating at 38.4% boa plansé.
        All digital health records are synchronized across the Vitality Node.
      </p>

      <div className="flex gap-3 mb-5">
        <StatBadge label="PENDING ALERTS" value="12" />
        <StatBadge label="CRITICAL GAPS" value="0" />
      </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        <button className="bg-[#A5F4B9] text-[#2d6a4f] font-semibold text-sm px-4 py-2 rounded-full hover:bg-white/90 transition-colors cursor-poin flex items-center gap-2">
          <BadgeCheck /> 
          <span>Run Full Audit</span>
        </button>
        <button className="bg-transparent text-white border border-white/50 font-semibold text-sm px-4 py-2 rounded-full hover:bg-white/10 transition-colors">
          Compliance Reports
        </button>
      </div>
    </div>
  );
};

export default NetworkVitalityCard;