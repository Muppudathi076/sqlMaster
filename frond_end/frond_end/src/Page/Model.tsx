import { useState,useEffect } from "react"
import toast from "react-hot-toast"
import { questionapiApi, valuesCheckingApi } from "../auth/authapi"
import { useParams } from "react-router-dom"
type Question = {
  id: number
  question: string
  difficulty: string
  model_no: number
  answer: string
}
function Model() {
  const {id }=  useParams()
  const [query, setQuery] = useState("")
  const [outputData, setOutputData] = useState<any[]>([])
  // const [output, setOutput] = useState("")
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const token = localStorage.getItem("access_token") || ""
  const fetching = async()=>{
    if (!id) return
    try{
      const response = await questionapiApi(Number(id),token)
      console.log("model page :",response)
      setQuestions(response)
    }catch(e){
    console.log("API Error:", e)
    toast.error("Something went wrong")
    }
  }
const handleRun = async () => {
  if (!query.trim()) {
    // setOutput("Please enter a SQL query")
    toast.error("Please enter a SQL query")
    return
  }

  if (!currentQuestion) return

  try {
    const res = await valuesCheckingApi(
      currentQuestion.id,
      query,
      token
    )

    // setOutput(res.message)

    if (res.success) {
      toast.success(res.message)

      if (res.data) {
        setOutputData(res.data) 
      }

      setCurrentIndex((prev) => prev + 1)
      setQuery("")
    }else {
      toast.error(res.message, { duration: 2000 })
    }

  } catch (e: any) {
    const errorMsg =
      e?.response?.data?.message || "Server Error"

    // setOutput(errorMsg)
    toast.error(errorMsg, { duration: 2000 }) // ✅ correct usage
  }
}

useEffect(()=>{
  fetching()
},[id])

// useEffect(() => {
//   if (currentIndex >= questions.length) {
//     setOutput("🎉 All questions completed!")
//   }
// }, [currentIndex])

  const currentQuestion = questions[currentIndex] || null

  return (
    <div className="p-6  mx-auto min-h-screen bg-white text-black dark:bg-gray-900 dark:text-white transition-all">

      <h1 className="text-xl font-bold mb-4">SQL Practice</h1>

      <div className="mb-4 p-4 bg-gray-100 rounded dark:bg-gray-800">
        <p className="font-medium">
          {currentQuestion
            ? `Q${currentIndex + 1}: ${currentQuestion.question}`
            : "Loading..."}
        </p>
      </div>

      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type your SQL query here..."
        className="w-full h-32 p-3 border rounded mb-4 bg-white text-black dark:bg-gray-800 dark:text-white dark:border-gray-600"
      />

      <button
        onClick={handleRun}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Run Query
      </button>
      {outputData.length > 0 && (
  <div className="mt-6 bg-gray-100 dark:bg-gray-800 p-4 rounded">

    <h2 className="font-semibold mb-2">Output</h2>

    <table className="w-full border border-gray-300">
      <thead>
        <tr>
          {Object.keys(outputData[0]).map((col, i) => (
            <th key={i} className="border p-2 bg-gray-200">
              {col}
            </th>
          ))}
        </tr>
      </thead>

      <tbody>
        {outputData.map((row, i) => (
          <tr key={i}>
            {Object.values(row).map((val, j) => (
              <td key={j} className="border p-2">
                {val as string}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>

  </div>
)}
    </div>
  )
}

export default Model