import CriticalAlerts from "@/components/CriticalAlerts/CriticalAlerts";
import Navbar from "@/components/Navbar/Navbar";
import NetworkVitalityCard from "@/components/NetworkVitalityCard/NetworkVitalityCard";
import RecentPatients from "@/components/RecentPatients/RecentPatients";
import StatsRow from "@/components/StatsRow/StatsRow";

function DashboardDoctor() {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <Navbar />
      <NetworkVitalityCard />
      <StatsRow />
      <CriticalAlerts />
      <RecentPatients />
    </div>
  );
}

export default DashboardDoctor;