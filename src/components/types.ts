// src/components/Dashboard/types.ts

export interface Patient {
  id: string;
  name: string;
  avatar?: string;
  lastCheckIn: string;
  planStatus: 'active' | 'on-review' | 'lapsed';
  compliance: number;
}

export interface Alert {
  id: string;
  patientName: string;
  patientAvatar?: string;
  description: string;
  severity: 'critical' | 'warning';
  actions: string[];
}