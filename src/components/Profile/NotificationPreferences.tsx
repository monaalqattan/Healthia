import React, { useState } from 'react';
import { Bell } from 'lucide-react';

interface NotificationSetting {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

const Toggle: React.FC<{ enabled: boolean; onChange: () => void }> = ({ enabled, onChange }) => (
  <button
    onClick={onChange}
    className={`relative w-11 h-6 rounded-full transition-colors ${
      enabled ? 'bg-[#065F46]' : 'bg-gray-200'
    }`}
  >
    <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
      enabled ? 'translate-x-5' : 'translate-x-0'
    }`} />
  </button>
);

const NotificationPreferences: React.FC = () => {
  const [settings, setSettings] = useState<NotificationSetting[]>([
    { id: '1', label: 'New Appointment Requests', description: 'Email and Push notifications', enabled: true },
    { id: '2', label: 'Patient Messages',          description: 'Push notifications only',     enabled: true },
    { id: '3', label: 'System Updates',            description: 'Platform maintenance alerts',  enabled: false },
  ]);

  const toggle = (id: string) => {
    setSettings(prev =>
      prev.map(s => s.id === id ? { ...s, enabled: !s.enabled } : s)
    );
  };

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <h2 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-4">
        <Bell className="w-4 h-4 text-[#065F46]" />
        Notification Preferences
      </h2>

      {settings.map((s) => (
        <div key={s.id} className="flex justify-between items-center mb-4 last:mb-0">
          <div>
            <div className="text-sm font-medium text-gray-700">{s.label}</div>
            <div className="text-xs text-gray-400">{s.description}</div>
          </div>
          <Toggle enabled={s.enabled} onChange={() => toggle(s.id)} />
        </div>
      ))}
    </div>
  );
};

export default NotificationPreferences;