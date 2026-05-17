// src/store/appointmentStore.ts

// بنعرف نوع الـ Session
export interface Session {
  label: string
  from: string
  to: string
  enabled: boolean
}

// الـ sessions الافتراضية - نفس اللي في ManageAvailability
export const defaultSessions: Session[] = [
  { label: "Morning Session",   from: "09:00", to: "12:00", enabled: true  },
  { label: "Afternoon Session", from: "13:00", to: "16:00", enabled: true  },
  { label: "Evening Session",   from: "05:00", to: "07:00", enabled: false },
]

// دالة بتحول الـ sessions لـ time slots ظاهرة للـ patient
// بتاخد from و to وبتعمل slots كل 30 دقيقة
export function generateSlotsFromSessions(sessions: Session[]): string[] {
  const slots: string[] = []

  sessions
    .filter((s) => s.enabled) // بس الـ sessions المفعّلة
    .forEach((session) => {
      const [startH, startM] = session.from.split(":").map(Number)
      const [endH, endM]     = session.to.split(":").map(Number)

      let currentH = startH
      let currentM = startM

      // بنعمل slot كل 30 دقيقة من البداية للنهاية
      while (
        currentH < endH ||
        (currentH === endH && currentM < endM)
      ) {
        const period = currentH >= 12 ? "PM" : "AM"
        const hour12 = currentH % 12 || 12
        const minStr = currentM.toString().padStart(2, "0")
        slots.push(`${hour12}:${minStr} ${period}`)

        // نزيد 30 دقيقة
        currentM += 30
        if (currentM >= 60) {
          currentM -= 60
          currentH += 1
        }
      }
    })

  return slots
}