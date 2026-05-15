// Dashboard/RecentPatients.tsx

import React from 'react';
import type { Patient } from '../types';

const mockPatients: Patient[] = [
  { id: '#PT-9221', name: 'nour ahmed',  lastCheckIn: 'Oct 24, 10:45 AM', planStatus: 'active',    compliance: 95 },
  { id: '#PT-9805', name: 'manar rabie',  lastCheckIn: 'Oct 24, 09:15 AM', planStatus: 'on-review', compliance: 93 },
  { id: '#PT-7719', name: 'mona ahmed',     lastCheckIn: 'Oct 23, 04:30 PM', planStatus: 'lapsed',    compliance: 20 },
];

const statusConfig: Record<Patient['planStatus'], { bg: string; text: string; label: string }> = {
  'active':    { bg: 'bg-green-100',  text: 'text-green-700',  label: 'ACTIVE PLAN' },
  'on-review': { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'ON REVIEW'   },
  'lapsed':    { bg: 'bg-red-100',    text: 'text-red-600',    label: 'LAPSED'       },
};

const complianceBarColor = (value: number) => {
  if (value > 80) return 'bg-green-500';
  if (value > 50) return 'bg-orange-400';
  return 'bg-red-500';
};

const RecentPatients: React.FC = () => {
  return (
    <div className="bg-white rounded-xl p-4 md:p-5 shadow-sm relative mt-4 md:mt-6">

      {/* Header — على موبايل: عمود، على sm: صف */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
        <div>
          <h3 className="text-base font-bold text-gray-800">Recent Patients</h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Managing the most recent interactions and record updates.
          </p>
        </div>
        <button className="text-green-700 text-sm font-semibold hover:underline self-start sm:self-auto whitespace-nowrap">
          View Complete Directory →
        </button>
      </div>

      {/* overflow-x-auto عشان الجدول يتسكرول على موبايل */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse min-w-[580px]">
          <thead>
            <tr className="text-left text-xs text-gray-400 border-b border-gray-100">
              <th className="pb-2 font-medium">PATIENT NAME</th>
              <th className="pb-2 font-medium">LAST CHECK-IN</th>
              <th className="pb-2 font-medium">PLAN STATUS</th>
              <th className="pb-2 font-medium">COMPLIANCE</th>
              <th className="pb-2 font-medium">ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {mockPatients.map((patient) => {
              const status = statusConfig[patient.planStatus];
              return (
                <tr key={patient.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3">
                    <div className="font-semibold text-gray-800">{patient.name}</div>
                    <div className="text-xs text-gray-400">{patient.id}</div>
                  </td>
                  <td className="py-3 text-gray-500 whitespace-nowrap">{patient.lastCheckIn}</td>
                  <td className="py-3">
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap ${status.bg} ${status.text}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-16 md:w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${complianceBarColor(patient.compliance)}`}
                          style={{ width: `${patient.compliance}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">{patient.compliance}%</span>
                    </div>
                  </td>
                  <td className="py-3 text-gray-400 text-lg cursor-pointer hover:text-gray-600">⋮</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* FAB Button */}
      <button className="fixed bottom-4 right-4 md:bottom-6 md:right-6 bg-[#2d6a4f] text-white font-semibold text-xs md:text-sm px-4 py-2.5 md:px-5 md:py-3 rounded-full shadow-lg hover:bg-[#40916c] transition-colors">
        + Add New Patient
      </button>

    </div>
  );
};

export default RecentPatients;