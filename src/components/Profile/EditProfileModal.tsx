import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import type { DoctorData } from '../mockDoctor';

interface EditProfileModalProps {
  isOpen: boolean;
  doctor: DoctorData;
  onClose: () => void;
  onSave: (updatedData: DoctorData) => void;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ isOpen, doctor, onClose, onSave }) => {
  const [formData, setFormData] = useState<DoctorData>(doctor);
  useEffect(() => {
    setFormData(doctor);
  }, [doctor]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Edit Profile</h2>
            <p className="text-xs text-gray-400 mt-0.5">Update your personal and professional information.</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Full Name</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#065F46]/30" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Specialty</label>
            <input type="text" name="specialty" value={formData.specialty} onChange={handleChange}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#065F46]/30" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Bio</label>
            <textarea name="bio" value={formData.bio} onChange={handleChange} rows={3}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#065F46]/30 resize-none" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Email Address</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#065F46]/30" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Phone Number</label>
            <input type="tel" name="phone" value={formData.phone} onChange={handleChange}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#065F46]/30" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Office Location</label>
            <input type="text" name="location" value={formData.location} onChange={handleChange}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#065F46]/30" />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wide">Languages</label>
            <input type="text" name="languages" value={formData.languages} onChange={handleChange}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#065F46]/30" />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-5 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => onSave(formData)}
            className="px-5 py-2 text-sm bg-[#065F46] text-white font-semibold rounded-lg hover:bg-[#054d38] transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;