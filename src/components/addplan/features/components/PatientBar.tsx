// src/features/diet-plan/components/PatientBar.tsx
// يعتمد على: types | logic/calculations | logic/selectors

import type { PatientBarProps } from "../types";
import { getInitials, calculateBMI, getGoalLabel } from "../logic/calculations";
import { selectPatientStats } from "../logic/selectors";

export default function PatientBar({ firstName, lastName, weight, height, goal }: PatientBarProps) {
  const initials = getInitials(firstName, lastName);
  const bmi      = calculateBMI(weight, height);
  const goalText = getGoalLabel(goal);
  const stats    = selectPatientStats(weight, height, bmi, goalText);

  return (
    <div className="patient-bar">
      <div className="avatar">{initials}</div>
      <div className="patient-info">
        <h2>{firstName} {lastName}</h2>
        <span className="badge">Active Patient</span>
      </div>
      <div className="patient-stats">
        {stats.map((s) => (
          <div key={s.label} className="pstat">
            <label>{s.label}</label>
            <span className={s.green ? "green" : ""}>{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}