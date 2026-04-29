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

type ChartItem = {
  label: string
  value: number
}

interface FilterOption {
  key: string
  label: string
  data: ChartItem[]
}

interface ReusableChartProps {
  title: string
  filters: FilterOption[]
  color?: string
  height?: number
}

export default function UsageChart({
  title,
  filters,
  color = "#8b5cf6",
  height = 300
}: ReusableChartProps) {
  const [selectedFilter, setSelectedFilter] = useState(filters[0]?.key)

  const activeData =
    filters.find((item) => item.key === selectedFilter)?.data || []

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mt-6">
      <div className="flex justify-between mb-4">
        <h3 className="text-lg font-semibold text-black dark:text-white">
          {title}
        </h3>

        {filters.length > 1 && (
          <select
            className="border rounded p-1 dark:bg-gray-700"
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
          >
            {filters.map((filter) => (
              <option key={filter.key} value={filter.key}>
                {filter.label}
              </option>
            ))}
          </select>
        )}
      </div>

      <ResponsiveContainer width="100%" height={height}>
        <BarChart data={activeData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="value" fill={color} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}