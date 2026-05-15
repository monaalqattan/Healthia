import { AppSidebar } from "@/components/app-sidebar"
import CriticalAlerts from "@/components/CriticalAlerts/CriticalAlerts";
import Navbar from "@/components/Navbar/Navbar";
import NetworkVitalityCard from "@/components/NetworkVitalityCard/NetworkVitalityCard";
import RecentPatients from "@/components/RecentPatients/RecentPatients";
import StatsRow from "@/components/StatsRow/StatsRow";
function DashboardDoctor() {
  return (
  <div className="w-full">
  <div className="grid grid-cols-12 gap-4">
    <div className="hidden lg:block lg:col-span-2">
      <AppSidebar />
    </div>
    <div className="col-span-12 lg:col-span-10">
      <Navbar />
      <NetworkVitalityCard />
      <StatsRow />
      <CriticalAlerts />
      <RecentPatients />
    </div>

  </div>
</div>
  )
}
export default DashboardDoctor
