import { useMemo, useState } from "react"

interface Column {
  header: string
  accessor: string
}

interface ReusableTableProps {
  columns: Column[]
  data: Record<string, any>[]
  actions?: (row: Record<string, any>) => React.ReactNode
  onRowClick?: (row: Record<string, any>) => void
  height?: string
  pagination?:boolean
  hasData?:boolean
}

function ReusableTable({
  columns,
  data,
  actions,
  onRowClick,
  height = "320px",
  pagination,
  hasData
}: ReusableTableProps) {
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(data.length / rowsPerPage)

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage
    const end = start + rowsPerPage
    return data.slice(start, end)
  }, [data, currentPage, rowsPerPage])

  const handleRowsChange = (value: number) => {
    setRowsPerPage(value)
    setCurrentPage(1)
  }
  return (
    <div className="w-full bg-white dark:bg-gray-800 shadow-md rounded-xl overflow-hidden">      
      <div
        className="w-full overflow-x-auto overflow-y-auto"
        style={{ height}}
      >
        <table className="min-w-[430px] w-full text-sm text-gray-700 dark:text-gray-200">
          <thead className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 uppercase text-xs sticky top-0 z-10">
            <tr>
              {columns.map((col, index) => (
                <th key={index} className="px-2 py-2 text-center">
                  {col.header}
                </th>
              ))}
              {actions && (
                <th className="px-2 py-2 text-center">Actions</th>
              )}
            </tr>
          </thead>

          <tbody>
            {paginatedData.length > 0 ? (
              paginatedData.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  onClick={() => onRowClick?.(row)}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 even:bg-gray-50 dark:even:bg-gray-900 transition"
                >
                  {columns.map((col, index) => (
                    <td
                      key={index}
                      className="px-2 py-2 text-center break-words"
                    >
                      {row[col.accessor]}
                    </td>
                  ))}

                  {actions && (
                    <td className="px-2 py-2 text-center">
                      {actions(row)}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="text-center py-4 text-gray-500 dark:text-gray-400"
                >
                  No Data Found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {pagination && (
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 py-3 border-t dark:border-gray-700 w-full">
  
  <div className="flex flex-wrap items-center gap-2 text-sm">
    <span className="text-black whitespace-nowrap">
      Rows per page:
    </span>

    <select
      value={rowsPerPage}
      onChange={(e) => handleRowsChange(Number(e.target.value))}
      className="border rounded px-2 py-1 dark:bg-gray-700"
    >
      {[5, 10, 50, 100, 200].map((num) => (
        <option key={num} value={num}>
          {num}
        </option>
      ))}
    </select>

    <span className="text-black whitespace-nowrap">
      Page {currentPage} of {totalPages || 1}
    </span>
  </div>

  <div className="flex gap-2 w-full sm:w-auto">
    <button
      onClick={() => setCurrentPage((prev) => prev - 1)}
      disabled={!hasData || currentPage === 1}
      className="flex-1 sm:flex-none px-4 py-2 border rounded disabled:opacity-50"
    >
      Previous
    </button>

    <button
      onClick={() => setCurrentPage((prev) => prev + 1)}
      disabled={!hasData || currentPage === totalPages}
      className="flex-1 sm:flex-none px-4 py-2 border rounded disabled:opacity-50"
    >
      Next
    </button>
  </div>
</div>
      )}
    </div>
  )
}

export default ReusableTable