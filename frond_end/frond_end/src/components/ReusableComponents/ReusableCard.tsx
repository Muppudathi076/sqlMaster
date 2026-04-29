import type{ IconType } from "react-icons"

interface CardProps {
  title: string
  value: string | number
  color: string
  Icon?: IconType
}

function ReusableCard({ title, value, color, Icon }: CardProps) {
  return (
    <div
      className="flex items-center justify-between p-4 rounded-lg text-black dark:text-white border border-white/5 shadow-sm"
      style={{ 
        background: `linear-gradient(135deg, ${color}20, ${color}10)`,
        boxShadow: `0 4px 15px -3px ${color}30`
      }}
    >
      <div>
        <h4 className="text-sm font-medium opacity-90">{title}</h4>
        <h2 className="text-xl font-bold">{value}</h2>
      </div>

      <div className="text-3xl" style={{ color: color }}>
        {Icon && <Icon size={30} />}
      </div>
    </div>
  )
}

export default ReusableCard