import { useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts"

type ChartData = {
  day?: string
  date?: string
  time: number
}

interface Props {
  weeklyData: ChartData[]
  monthlyData: ChartData[]
}

export default function UsageChart({ weeklyData, monthlyData }: Props) {

  const [filter, setFilter] = useState("weekly")

  // 🔥 convert backend data → chart format
  const formattedWeekly = weeklyData.map(item => ({
    name: item.day,
    time: item.time
  }))

  const formattedMonthly = monthlyData.map(item => ({
    name: item.date,
    time: item.time
  }))

  const data = filter === "weekly" ? formattedWeekly : formattedMonthly

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mt-6">

      <div className="flex justify-between mb-4">

        <h3 className="text-lg font-semibold text-black dark:text-white">
          Learning Activity
        </h3>

        <select
          className="border rounded p-1 dark:bg-gray-700"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>

      </div>

      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>

          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb"/>

          <XAxis dataKey="name" stroke="#6b7280"/>

          <YAxis stroke="#6b7280"/>

          <Tooltip />

          <Bar
            dataKey="time"
            fill="#8b5cf6"
            radius={[6,6,0,0]}
          />

        </BarChart>
      </ResponsiveContainer>

    </div>
  )
}