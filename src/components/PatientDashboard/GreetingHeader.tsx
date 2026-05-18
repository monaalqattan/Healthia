// components/PatientDashboard/GreetingHeader.tsx

import React from 'react';

const GreetingHeader: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-5">
      <div>
        <h1 className="text-3xl font-bold text-[#065F46]">
          Good morning, Nourhan 👋
        </h1>
        <p className="text-sm text-gray-400 mt-1">
          Your body is a sanctuary. Today's the perfect day for progress.
        </p>
      </div>
      <div className="text-right shrink-0">
        <div className="text-[10px] text-gray-400 uppercase tracking-wide">October 24, 2023</div>
        <div className="text-sm font-bold text-gray-700">Sunny, 22°C</div>
      </div>
    </div>
  );
};

export default GreetingHeader;