import React, { useState } from 'react';
import { Pencil } from 'lucide-react';
import EditProfileModal from '../Profile/EditProfileModal';
import type { DoctorData } from '../mockDoctor';

interface DoctorHeaderProps {
  doctor: DoctorData;
  onSave: (updatedData: DoctorData) => void;
}

const DoctorHeader: React.FC<DoctorHeaderProps> = ({ doctor, onSave }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-2xl p-5 md:p-6 shadow-sm mb-4">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-5">
          <div className="flex gap-4 items-start">
            <div className="relative shrink-0">
              <div className="w-20 h-20 rounded-xl bg-gray-200" />
              <span className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-xl font-bold text-gray-800">{doctor.name}</h1>
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
                  {doctor.title}
                </span>
              </div>
              <p className="text-sm font-semibold text-[#065F46] mb-2">{doctor.specialty}</p>
              <p className="text-xs text-gray-500 leading-relaxed max-w-md">{doctor.bio}</p>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 border border-gray-200 text-gray-600 text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors shrink-0 self-start"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit Profile
          </button>
        </div>

        <div className="flex flex-wrap gap-6 pt-4 border-t border-gray-100">
          <div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Total Patients</div>
            <div className="text-2xl font-bold text-gray-800">2,450+</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Success Rate</div>
            <div className="text-2xl font-bold text-gray-800">98.5%</div>
          </div>
          <div>
            <div className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Plans Created</div>
            <div className="text-2xl font-bold text-gray-800">8,120</div>
          </div>
        </div>
      </div>

      <EditProfileModal
        isOpen={isModalOpen}
        doctor={doctor}
        onClose={() => setIsModalOpen(false)}
        onSave={(updatedData) => {
          onSave(updatedData);
          setIsModalOpen(false);
        }}
      />
    </>
  );
};

export default DoctorHeader;