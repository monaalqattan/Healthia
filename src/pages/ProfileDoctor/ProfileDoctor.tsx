import { useState, useEffect } from "react"
import Navbar from "@/components/Navbar/Navbar"
import DoctorHeader from "@/components/DoctorHeader/DoctorHeader"
import PersonalInfo from "@/components/Profile/PersonalInfo"
import ProfessionalDetails from "@/components/Profile/ProfessionalDetails"
import AvailabilitySchedule from "@/components/Profile/AvailabilitySchedule"
import NotificationPreferences from "@/components/Profile/NotificationPreferences"
import AccountSecurity from "@/components/Profile/AccountSecurity"
import { doctorService } from "@/services/api"

const ProfileDoctor: React.FC = () => {
  const [doctor, setDoctor] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    doctorService.getMyProfile()
      .then(res => setDoctor(res.data))
      .catch(console.error)
      .finally(() => setIsLoading(false))
  }, [])

  const handleSave = (updatedData: any) => {
    setDoctor((prev: any) => ({ ...prev, ...updatedData }))
  }

  if (isLoading) return (
    <>
      <Navbar />
      <div className="flex h-screen items-center justify-center text-gray-400">Loading...</div>
    </>
  )

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <DoctorHeader doctor={doctor} onSave={handleSave} />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <PersonalInfo doctor={doctor} />
          <ProfessionalDetails doctor={doctor} />
        </div>
        <AvailabilitySchedule />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <NotificationPreferences doctor={doctor} />
          <AccountSecurity />
        </div>
      </div>
    </>
  )
}

export default ProfileDoctor