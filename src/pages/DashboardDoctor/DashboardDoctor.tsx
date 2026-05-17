import CriticalAlerts from "@/components/CriticalAlerts/CriticalAlerts";
import Navbar from "@/components/Navbar/Navbar";
import NetworkVitalityCard from "@/components/NetworkVitalityCard/NetworkVitalityCard";
import { DataTable } from "@/components/PatientData/data-table";
import { columns, type DataType } from "@/components/PatientData/columns"
import StatsRow from "@/components/StatsRow/StatsRow";

function DashboardDoctor() {
  const data: DataType[] = [
    {
      id: "1",
      patientName: "Julian Rivers",
      patientId: "#VT-9021",
      planStatus: "Active Plan",
      lastVisit: "Oct 24, 10:45 AM",
      compliance: 95,
      avatar: "https://i.pravatar.cc/150?u=1",
    },
    {
      id: "2",
      patientName: "Sarah Jenkins",
      patientId: "#VT-8832",
      planStatus: "On Review",
      lastVisit: "Oct 24, 09:15 AM",
      compliance: 60,
      avatar: "https://i.pravatar.cc/150?u=2",
    },
    {
      id: "3",
      patientName: "David Chen",
      patientId: "#VT-7719",
      planStatus: "Lapsed",
      lastVisit: "Oct 23, 04:30 PM",
      compliance: 25,
      avatar: "https://i.pravatar.cc/150?u=3",
    },
    {
      id: "4",
      patientName: "Emily Davis",
      patientId: "#VT-6543",
      planStatus: "Active Plan",
      lastVisit: "Oct 22, 11:00 AM",
      compliance: 85,
      avatar: "https://i.pravatar.cc/150?u=4",
    },
    {
      id: "5",
      patientName: "Michael Brown",
      patientId: "#VT-5432",
      planStatus: "On Review",
      lastVisit: "Oct 21, 02:15 PM",
      compliance: 70,
      avatar: "https://i.pravatar.cc/150?u=5",
    },
    {
      id: "6",
      patientName: "Olivia Wilson",
      patientId: "#VT-4321",
      planStatus: "Active Plan",
      lastVisit: "Oct 20, 09:30 AM",
      compliance: 90,
      avatar: "https://i.pravatar.cc/150?u=6",
    },
  ]
  return (
    <>
      <Navbar />
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <NetworkVitalityCard />
      <StatsRow />
      <CriticalAlerts />
      <DataTable columns={columns} data={data} />
    </div>
    </>
  )
}

export default DashboardDoctor;