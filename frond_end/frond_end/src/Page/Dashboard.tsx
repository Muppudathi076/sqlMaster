import { useEffect, useState } from "react";
import { Trophy, Clock, Globe, GraduationCap } from "lucide-react"
import ReusableCard from "../components/ReusableComponents/ReusableCard";
import UsageChart from "../components/ReusableComponents/Usagechart"
import ReusableTable from "../components/ReusableComponents/ReusableTable"
import ProgressPieChart from "../components/ReusableComponents/ProgressPieChart";
import { userdashboardApi } from "../auth/authapi";
import toast from "react-hot-toast";

function Dashboard() {

  // const [loading, setLoading] = useState(false)

  const username = localStorage.getItem("user")
  const [cards, setCards] = useState<any>(null)
  const [weeklyData, setWeeklyData] = useState([])
  const [monthlyData, setMonthlyData] = useState([])
  const [tableData, setTableData] = useState([])
  const [pieData, setPieData] = useState([])
  const columns = [
  { header: "Topic", accessor: "topic" },
  { header: "Total Questions", accessor: "total" },
  { header: "Solved", accessor: "solved" },
  { header: "Remaining", accessor: "remaining" },
  { header: "Progress", accessor: "progress" }
]

  const token = localStorage.getItem("access_token") || ""
  const fetching = async()=>{
    try{
      const res = await userdashboardApi(token)
      console.log(res)
      setCards(res.cards)
      setWeeklyData(res.weekly_chart)
      setMonthlyData(res.monthly_chart)
      setTableData(res.table)
      setPieData(res.pie_chart)
    }catch(e){
      toast.error("Some Went Wrong",{duration:2000})
    }
  }

  useEffect(()=>{
    fetching()
  },[])

  return (
    <div className="min-h-screen bg-white dark:bg-black p-5">

      <div className="bg-gradient-to-r from-purple-600 to-indigo-400 rounded-xl p-6 text-white shadow-lg mb-6">
        <h2 className="text-2xl font-semibold">
          Welcome back, {username}!
        </h2>
        <p className="opacity-90 mt-1">
          Ready to power up your brain today?
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ReusableCard
          title="Users Score"
          value={cards?.total_score}
          color="#3b82f6"
          Icon={Trophy}
        />
        <ReusableCard
          title="Total Time"
          value={cards?.total_time}
          color="#22c55e"
          Icon={Clock}
        />
        <ReusableCard
          title="Global Ranking"
          value={cards?.global_rank}
          color="#ef4444"
          Icon={Globe}
        />
        <ReusableCard
          title="Total Courses"
          value={cards?.total_courses}
          color="#f59e0b"
          Icon={GraduationCap}
        />

      </div>
      <UsageChart   weeklyData={weeklyData} monthlyData={monthlyData}/>
      <div className="grid grid-cols-4 gap-6 items-start mt-6">
        <div className="col-span-3">
          <ReusableTable columns={columns} data={tableData} />
        </div>
        <div className="col-span-1"><ProgressPieChart data={pieData} /></div>
      </div>
    </div>
  )
}

export default Dashboard