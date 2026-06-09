import React from 'react';
import { Briefcase } from 'lucide-react';

const ProfessionalDetails: React.FC<{ doctor: any }> = ({ doctor }) => {
  const specialties: string[] = doctor?.specialties || []
  const education = doctor?.education?.[0]

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <h2 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-4">
        <Briefcase className="w-4 h-4 text-[#065F46]" />
        Professional Details
      </h2>

      {/* License */}
      {(doctor?.licenseId || doctor?.licenseExpiry) && (
        <>
          <div className="text-[10px] text-gray-400 uppercase tracking-wide mb-2">Medical License</div>
          <div className="flex justify-between items-center bg-gray-50 rounded-lg px-3 py-2 mb-4">
            <div>
              <div className="text-xs font-medium text-gray-700">License ID</div>
              {doctor?.licenseExpiry && (
                <div className="text-[10px] text-gray-400">Expires {doctor.licenseExpiry}</div>
              )}
            </div>
            <span className="text-xs font-bold text-[#065F46]">{doctor.licenseId}</span>
          </div>
        </>
      )}

      {/* Specialties */}
      {specialties.length > 0 && (
        <>
          <div className="text-[10px] text-gray-400 uppercase tracking-wide mb-2">Specialties & Focus</div>
          <div className="flex flex-wrap gap-2 mb-4">
            {specialties.map((s: string) => (
              <span key={s} className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">{s}</span>
            ))}
          </div>
        </>
      )}

      {/* Education */}
      {education?.school && (
        <>
          <div className="text-[10px] text-gray-400 uppercase tracking-wide mb-2">Education</div>
          <div className="flex items-start gap-3">
            <div className="w-7 h-7 rounded-full bg-[#065F46]/10 flex items-center justify-center shrink-0">
              <Briefcase className="w-3.5 h-3.5 text-[#065F46]" />
            </div>
            <div>
              <div className="text-sm font-semibold text-gray-700">{education.school}</div>
              {(education.degree || education.years) && (
                <div className="text-xs text-gray-400">
                  {education.degree}{education.degree && education.years ? ' • ' : ''}{education.years}
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Empty state */}
      {!doctor?.licenseId && specialties.length === 0 && !education?.school && (
        <p className="text-sm text-gray-400 text-center py-4">
          No professional details added yet. Click Edit Profile to add.
        </p>
      )}
    </div>
  );
};

export default ProfessionalDetails;