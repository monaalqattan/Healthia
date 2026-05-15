// Dashboard/CriticalAlerts.tsx

import React from 'react';
import type { Alert } from '../types';

const mockAlerts: Alert[] = [
  {
    id: '1',
    patientName: 'Elena Vance',
    description: 'Abnormal Cardiac Signal detected via Vitality Unit.',
    severity: 'critical',
    actions: ['Review ECG', 'Call Caregiver'],
  },
  {
    id: '2',
    patientName: 'Marcus Holloway',
    description: 'Passive-insulin Signal reported. Patient is unresponsive to auto-notify.',
    severity: 'warning',
    actions: ['Deploy Protocol'],
  },
];

const AlertItem: React.FC<{ alert: Alert }> = ({ alert }) => (
  <div className={`border-l-4 pl-3 mb-4 ${
    alert.severity === 'critical' ? 'border-red-500' : 'border-orange-400'
  }`}>
    <div className="font-semibold text-sm text-gray-800">{alert.patientName}</div>
    <div className="text-xs text-gray-500 my-1">{alert.description}</div>

    {/* على موبايل: الأزرار تاخد عرض كامل — على sm: عادي جنب بعض */}
    <div className="flex flex-col sm:flex-row gap-2">
      {alert.actions.map((action) => (
        <button
          key={action}
          className="text-xs px-3 py-1.5 sm:py-1 rounded-md border border-gray-200 bg-white hover:bg-gray-50 transition-colors w-full sm:w-auto text-center"
        >
          {action}
        </button>
      ))}
    </div>
  </div>
);

const CriticalAlerts: React.FC = () => {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-gray-800">Critical Alerts</h3>
        <span className="bg-red-500 text-white text-[10px] font-semibold px-2 py-1 rounded-full whitespace-nowrap">
          REQUIRES ACTION
        </span>
      </div>

      {mockAlerts.map((alert) => (
        <AlertItem key={alert.id} alert={alert} />
      ))}

      <button className="text-green-700 text-xs font-medium mt-2 hover:underline">
        View All 14 Alerts →
      </button>

    </div>
  );
};

export default CriticalAlerts;