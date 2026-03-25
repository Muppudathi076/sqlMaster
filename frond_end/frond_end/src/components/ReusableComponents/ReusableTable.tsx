interface Column {
  header: string
  accessor: string
}

interface ReusableTableProps {
  columns: Column[]
  data: Record<string, any>[]
  actions?: (row: Record<string, any>) => React.ReactNode
  onRowClick?: (row: Record<string, any>) => void
}

function ReusableTable({ columns, data, actions, onRowClick }: ReusableTableProps) {

  return (
    <div className="w-full bg-white dark:bg-gray-800 shadow-md rounded-xl overflow-hidden">
      <div className="w-full h-[280px] overflow-x-auto overflow-y-auto">
        <table className="min-w-[280px] w-full text-sm text-gray-700 dark:text-gray-200">

          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 uppercase text-xs sticky top-0 z-10">
            <tr>

              {columns.map((col, index) => (
                <th key={index} className="px-4 py-3 text-center">
                  {col.header}
                </th>
              ))}

              {actions && (
                <th className="px-4 py-3 text-center">
                  Actions
                </th>
              )}

            </tr>
          </thead>

          <tbody>

            {data.length > 0 ? (
              data.map((row, rowIndex) => (

                <tr
                  key={rowIndex}
                  onClick={() => onRowClick && onRowClick(row)}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 even:bg-gray-50 dark:even:bg-gray-900 transition"
                >

                  {columns.map((col, index) => (
                    <td key={index} className="px-4 py-3 text-center break-words">
                      {row[col.accessor]}
                    </td>
                  ))}

                  {actions && (
                    <td className="px-4 py-3 text-center">
                      {actions(row)}
                    </td>
                  )}

                </tr>

              ))
            ) : (

              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="text-center py-6 text-gray-500 dark:text-gray-400"
                >
                  No Data Found
                </td>
              </tr>

            )}

          </tbody>

        </table>

      </div>

    </div>
  )
}

export default ReusableTable