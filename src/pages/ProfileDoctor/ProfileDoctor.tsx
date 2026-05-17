import DoctorHeader from "@/components/DoctorHeader/DoctorHeader";
import {mockDoctor, type DoctorData } from "@/components/mockDoctor";
import Navbar from "@/components/Navbar/Navbar";
import AccountSecurity from "@/components/Profile/AccountSecurity";
import AvailabilitySchedule from "@/components/Profile/AvailabilitySchedule";
import NotificationPreferences from "@/components/Profile/NotificationPreferences";
import PersonalInfo from "@/components/Profile/PersonalInfo";
import ProfessionalDetails from "@/components/Profile/ProfessionalDetails";
import { useState } from "react";


const ProfileDoctor: React.FC = () => {
const [doctor, setDoctor] = useState<DoctorData>(mockDoctor);
const handleSave = (updatedData: DoctorData) => {
    setDoctor(updatedData);
  }
  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <DoctorHeader doctor={doctor} onSave={handleSave} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <PersonalInfo doctor ={doctor} />
        <ProfessionalDetails />
      </div>
      <AvailabilitySchedule />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <NotificationPreferences />
        <AccountSecurity />
      </div>
    </div>
    </>
  );
};

export default ProfileDoctor;