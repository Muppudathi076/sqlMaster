// import { useEffect } from "react";
import { Trophy, Clock, Globe, GraduationCap } from "lucide-react"
import ReusableCard from "../ReusableComponents/ReusableCard";
import ReusableTable from "../ReusableComponents/ReusableTable"
import ProgressPieChart from "../ReusableComponents/ProgressPieChart";
import UsageChart from "../ReusableComponents/Usagechart";

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
  const chartFilters = [
    {
      key: "weekly",
      label: "Weekly",
      data: [
        { label: "Mon", value: 12 },
        { label: "Tue", value: 18 },
        { label: "Wed", value: 10 },
        { label: "Thu", value: 25 },
        { label: "Fri", value: 15 },
        { label: "Sat", value: 20 },
        { label: "Sun", value: 14 }
      ]
    },
    {
      key: "monthly",
      label: "Monthly",
      data: [
        { label: "Week 1", value: 80 },
        { label: "Week 2", value: 65 },
        { label: "Week 3", value: 95 },
        { label: "Week 4", value: 70 }
      ]
    }
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
const pieData = [
  { name: "Completed", value: 70 },
  { name: "Remaining", value: 30 }
]
    return(
        <div className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cardData.map((card, i) => (
              <ReusableCard key={i} {...card} />
            ))}
          </div>
          <div className="p-2">
            <h2 className="text-black mt-2 font-bold flex items-center">Top 5 Users Details</h2>
            <div className="grid grid-cols-4 gap-6 items-start mt-6">
                <div className="col-span-3">
                    <ReusableTable columns={columns} data={data} height="280px"/>
                </div>
                <div className="col-span-1">
                  <ProgressPieChart
                  data={pieData}/>
                </div>
            </div>
          </div>
          <UsageChart       
          title="Admin Activity"
          filters={chartFilters}
          color="#3b82f6"
        />
        </div>
    )
}
export default AdminDashboard