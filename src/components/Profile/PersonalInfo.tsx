import React from 'react';
import { User } from 'lucide-react';
import type { DoctorData } from '../mockDoctor';

const Row: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="mb-4 last:mb-0">
    <div className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">{label}</div>
    <div className="text-sm text-gray-700">{value}</div>
  </div>
);

const PersonalInfo: React.FC<{ doctor: DoctorData }> = ({ doctor }) => {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <h2 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-4">
        <User className="w-4 h-4 text-[#065F46]" />
        Personal Information
      </h2>
      <Row label="Email Address"   value={doctor.email} />
      <Row label="Phone Number"    value={doctor.phone} />
      <Row label="Office Location" value={doctor.location} />
      <Row label="Languages"       value={doctor.languages} />
    </div>
  );
};

export default PersonalInfo;