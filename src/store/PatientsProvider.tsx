// src/store/PatientsProvider.tsx
// بيوفر الـ state للـ patients لكل الصفحات

import { useState, type ReactNode } from "react"
import { PatientsContext, INITIAL_PATIENTS } from "./patientsStore"
import type { PatientRecord } from "./patientsStore"

export default function PatientsProvider({ children }: { children: ReactNode }) {
  const [patients, setPatients] = useState<PatientRecord[]>(INITIAL_PATIENTS)
  const [selectedId, setSelectedId] = useState<string | null>(INITIAL_PATIENTS[0].id)

  const addPatient = (p: PatientRecord) => {
    setPatients(prev => [p, ...prev])
    setSelectedId(p.id)
  }

  const selectPatient = (id: string) => setSelectedId(id)

  return (
    <PatientsContext.Provider value={{ patients, addPatient, selectedId, selectPatient }}>
      {children}
    </PatientsContext.Provider>
  )
}