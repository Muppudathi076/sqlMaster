import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts"

type PieData = {
  name: string
  value: number
}

interface Props {
  data: PieData[]
}

const COLORS = ["#3b5bdb", "#e5e7eb"]

export default function ProgressPieChart({ data }: Props) {

  const total = data.reduce((acc, item) => acc + item.value, 0)

  const percentage =
    total > 0 ? Math.round((data[0]?.value / total) * 100) : 0

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow h-[280px] flex flex-col justify-between">

      <h3 className="text-lg font-semibold text-black dark:text-white">
        Course Activities
      </h3>

      <div className="relative w-full h-[160px] flex justify-center items-center">

        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              innerRadius={60}
              outerRadius={80}
              stroke="none"
            >
              {data.map((_, index) => (
                <Cell key={index} fill={COLORS[index]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute text-xl font-bold text-gray-700 dark:text-white">
          {percentage}%
        </div>

      </div>

      <div className="flex justify-center gap-6 text-sm">
        {data.map((item, index) => (
          <div key={index} className="flex text-black dark:text-white items-center gap-2">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[index] }}
            ></span>
            {item.name}
          </div>
        ))}
      </div>

    </div>
  )
}