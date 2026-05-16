import React from 'react';
import { Shield, ChevronRight, KeyRound, Smartphone, Monitor } from 'lucide-react';

const items = [
  { icon: KeyRound,   label: 'Change Password',           sub: 'Last updated 3 months ago' },
  { icon: Smartphone, label: 'Two-Factor Authentication', sub: 'Currently enabled (App-based)' },
  { icon: Monitor,    label: 'Active Sessions',           sub: 'Manage logged-in devices' },
];

const AccountSecurity: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm">
      <h2 className="flex items-center gap-2 text-sm font-bold text-gray-800 mb-4">
        <Shield className="w-4 h-4 text-[#065F46]" />
        Account & Security
      </h2>

      {items.map(({ icon: Icon, label, sub }) => (
        <button
          key={label}
          className="flex items-center justify-between w-full py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50 rounded-lg px-2 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Icon className="w-4 h-4 text-gray-400" />
            <div className="text-left">
              <div className="text-sm font-medium text-gray-700">{label}</div>
              <div className="text-xs text-gray-400">{sub}</div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-300" />
        </button>
      ))}
    </div>
  );
};

export default AccountSecurity;