// Dashboard/StatsRow.tsx

import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  badge?: string;
  badgeClass?: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, badge, badgeClass }) => (
  <div className="bg-white rounded-xl px-3 py-3 md:px-5 md:py-4 flex-1 shadow-sm">
    <div className="flex justify-between items-center mb-2 flex-wrap">
      <span className="text-[10px] md:text-xs text-gray-400 uppercase tracking-wide">{title}</span>
      {badge && (
        <span className={`text-[10px] md:text-xs font-semibold px-2 py-0.5 rounded-full ${badgeClass}`}>
          {badge}
        </span>
      )}
    </div>
    <div className="text-xl md:text-3xl font-bold text-gray-800">{value}</div>
  </div>
);

const StatsRow: React.FC = () => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6">
      <StatCard title="Total Patients"   value="1,284" badge="+10%"   badgeClass="bg-green-100 text-green-700" />
      <StatCard title="Active Patients"  value="856"   badge="Active" badgeClass="bg-green-100 text-green-700" />
      <StatCard title="Appointments"     value="18"    badge="Today"  badgeClass="bg-orange-100 text-orange-600" />
      <StatCard title="Pending Requests" value="06"    badge="New"    badgeClass="bg-red-100 text-red-600" />
    </div>
  );
};

export default StatsRow;