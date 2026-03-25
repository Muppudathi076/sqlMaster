// import { useEffect } from "react";
import { Trophy, Clock, Globe, GraduationCap } from "lucide-react"
import ReusableCard from "../ReusableComponents/ReusableCard";
import ReusableTable from "../ReusableComponents/ReusableTable"
import ProgressPieChart from "../ReusableComponents/ProgressPieChart";

function AdminDashboard () {
const cardData = [
  {
    title: "Total Users",
    value: "150",
    color: "#3b82f6",
    Icon: Trophy,
  },
  {
    title: "Total Questions",
    value: "320",
    color: "#22c55e",
    Icon: GraduationCap,
  },
  {
    title: "Active Today",
    value: "45",
    color: "#f59e0b",
    Icon: Clock,
  },
  {
    title: "Submissions",
    value: "890",
    color: "#ef4444",
    Icon: Globe,
  },
]
const columns = [
  { header: "User Name", accessor: "name" },
  { header: "Email", accessor: "email" },
  { header: "Level", accessor: "level" },
  { header: "Score", accessor: "score" },
  { header: "Status", accessor: "status" },
]

const data = [
  {
    name: "Arun",
    email: "arun@gmail.com",
    level: "Level 1",
    score: 85,
    status: "Active",
  },
  {
    name: "Priya",
    email: "priya@gmail.com",
    level: "Level 2",
    score: 92,
    status: "Active",
  },
  {
    name: "Karthik",
    email: "karthik@gmail.com",
    level: "Level 1",
    score: 70,
    status: "Inactive",
  },
  {
    name: "Sneha",
    email: "sneha@gmail.com",
    level: "Level 3",
    score: 96,
    status: "Active",
  },
]
    return(
        <>
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
  {cardData.map((card, i) => (
    <ReusableCard key={i} {...card} />
  ))}
</div>
        <div className="grid grid-cols-4 gap-6 items-start mt-6">
            <div className="col-span-3">
                <ReusableTable columns={columns} data={data} />
            </div>
            <div className="col-span-1"><ProgressPieChart /></div>
        </div>
        </>
    )
}
export default AdminDashboard