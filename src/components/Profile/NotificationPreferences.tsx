import React, { useState, useEffect } from 'react';
import { Bell, Loader2 } from 'lucide-react';
import { doctorService } from '@/services/api';

const Toggle: React.FC<{ enabled: boolean; onChange: () => void; disabled?: boolean }> = ({ enabled, onChange, disabled }) => (
  <button onClick={onChange} disabled={disabled}
    className={`relative w-11 h-6 rounded-full transition-colors disabled:opacity-50 ${enabled ? 'bg-[#065F46]' : 'bg-gray-200'}`}>
    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${enabled ? 'translate-x-5' : 'translate-x-0'}`} />
  </button>
);

interface Props { doctor: any }

const NotificationPreferences: React.FC<Props> = ({ doctor }) => {
  const [prefs, setPrefs] = useState({
    newAppointments: true,
    patientMessages: true,
    systemUpdates:   false,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saved,    setSaved]    = useState(false);

  // تحميل الـ preferences من الـ doctor data
  useEffect(() => {
    const np = doctor?.notificationPreferences;
    setPrefs({
      newAppointments: np?.newAppointments !== undefined ? np.newAppointments : true,
      patientMessages: np?.patientMessages !== undefined ? np.patientMessages : true,
      systemUpdates:   np?.systemUpdates   !== undefined ? np.systemUpdates   : false,
    });
  }, [doctor]);

  const handleToggle = async (key: keyof typeof prefs) => {
    const updated = { ...prefs, [key]: !prefs[key] };
    setPrefs(updated);
    setIsSaving(true);
    try {
      await doctorService.updateNotifications(updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      // revert on error
      setPrefs(prefs);
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const settings = [
    { key: 'newAppointments' as const, label: 'New Appointment Requests', description: 'Email and Push notifications' },
    { key: 'patientMessages' as const, label: 'Patient Messages',          description: 'Push notifications only'     },
    { key: 'systemUpdates'   as const, label: 'System Updates',            description: 'Platform maintenance alerts'  },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h2 className="flex items-center gap-2 text-sm font-bold text-gray-800">
          <Bell className="w-4 h-4 text-[#065F46]" />
          Notification Preferences
        </h2>
        {isSaving && <Loader2 size={13} className="animate-spin text-gray-400"/>}
        {saved    && <span className="text-xs text-green-600 font-semibold">Saved ✓</span>}
      </div>

      {settings.map(s => (
        <div key={s.key} className="flex justify-between items-center mb-4 last:mb-0">
          <div>
            <div className="text-sm font-medium text-gray-700">{s.label}</div>
            <div className="text-xs text-gray-400">{s.description}</div>
          </div>
          <Toggle enabled={prefs[s.key]} onChange={() => handleToggle(s.key)} disabled={isSaving} />
        </div>
      ))}
    </div>
  );
};

export default NotificationPreferences;