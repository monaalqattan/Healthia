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

  const updatePatient = (id: string, updates: Partial<PatientRecord>) =>
    setPatients(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p))

  const deletePatient = (id: string) => {
    setPatients(prev => prev.filter(p => p.id !== id))
    setSelectedId(prev => prev === id ? INITIAL_PATIENTS[0]?.id ?? null : prev)
  }

  const selectPatient = (id: string) => setSelectedId(id)

  return (
    <PatientsContext.Provider value={{ patients, addPatient, updatePatient, deletePatient, selectedId, selectPatient }}>
      {children}
    </PatientsContext.Provider>
  )
}