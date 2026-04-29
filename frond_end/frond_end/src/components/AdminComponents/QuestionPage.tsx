import { useEffect, useState } from "react"
import { Pencil, Trash2,Filter } from "lucide-react"
import ReusableTable from "../ReusableComponents/ReusableTable"
import toast from "react-hot-toast"
import { addQuestionApi, questiondeleteByIdApi, QuestionGetAllApi, questionUpdatedByIdApi } from "../../auth/AdminAuthApi"
import { useParams } from "react-router-dom"
type Question = {
  id: number
  question: string
  difficulty: string
  model_no: number
}

function QuestionPage() {

  const { id } = useParams()
  const token = localStorage.getItem("access_token") || ""

  const [questions, setQuestions] = useState<any[]>([])
  const [selectedRows, setSelectedRows] = useState<number[]>([])
  const [models, setModels] = useState<number[]>([])
  const [difficulties, setDifficulties] = useState<string[]>([])
  const [showModal, setShowModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)
  const [modelFilter, setModelFilter] = useState<string>("")
  const [difficultyFilter, setDifficultyFilter] = useState<string>("")
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)
  const [showFilter, setShowFilter] = useState(false)
  const [formData, setFormData] = useState({
    question: "",
    difficulty: "easy",
    answer: "",
  })

  const fetching = async () => {
    try {
      const response = await QuestionGetAllApi(token)
      const data: Question[] = response.data
      setQuestions(data)
      const uniqueModels = [...new Set(data.map((q: any) => q.model_no))]
      setModels(uniqueModels)

      const uniqueDifficulties = [...new Set(data.map((q: any) => q.difficulty))]
      setDifficulties(uniqueDifficulties)
    } catch (e) {
      console.log("API Error:", e)
      toast.error("Something went wrong")
    }
  }
const filteredData = questions.filter((q: any) => {
  return (
    (modelFilter ? q.model_no === Number(modelFilter) : true) &&
    (difficultyFilter ? q.difficulty === difficultyFilter : true)
  )
})

  useEffect(() => {
    fetching()
  }, [])

const handleSubmit = async () => {
  try {
    if (isEdit && editIndex !== null) {
      const questionId = questions[editIndex].id

      await questionUpdatedByIdApi(
        questionId,
        token,
        formData
      )

      await fetching()
      toast.success("Question updated successfully")
    } else {
      const payload = {
        ...formData,
        model_no: id
      }

      const res = await addQuestionApi(token, payload)

      setQuestions((prev) => [...prev, res.data])
      toast.success("Question added successfully")
    }

    setShowModal(false)
    setFormData({
      question: "",
      difficulty: "easy",
      answer: ""
    })
    setIsEdit(false)
    setEditIndex(null)

  } catch (e: any) {
    console.log("submit api error:", e)

    const backendMessage =
      e.response?.data?.errors?.non_field_errors?.[0] ||
      e.response?.data?.message ||
      "Something went wrong"

    toast.error(backendMessage)
  }
}

const handleEdit = (index: number) => {
  const q = questions[index]

  setFormData({
    question: q.question,
    difficulty: q.difficulty,
    answer: q.answer
  })

  setEditIndex(index)
  setIsEdit(true)
  setShowModal(true)
}

  const handleDelete = async() => {
    try{
      if (deleteIndex !== null) {
        await questiondeleteByIdApi(deleteIndex,token)
        // setQuestions(updated)
        await fetching()
        toast.success("Deleted successfully")
        setShowDeleteModal(false)
      }
    }catch(e:any){
      console.log("delete api",e)
      toast.error("Some went wrong",{duration:2000})
    }
  }

  // ✅ SELECT BOX
  const handleSelect = (index: number) => {
    if (selectedRows.includes(index)) {
      setSelectedRows(selectedRows.filter(i => i !== index))
    } else {
      setSelectedRows([...selectedRows, index])
    }
  }

  const columns = [
    {
      header: "",
      accessor: "select",
      cell: (_: any, index: number) => (
        <input
          type="checkbox"
          checked={selectedRows.includes(index)}
          onChange={() => handleSelect(index)}
        />
      ),
    },
    { header: "Question", accessor: "question" },
    { header: "Difficulty", accessor: "difficulty" },
    { header: "Model No", accessor: "model_no" },
    { header: "Answer", accessor: "answer" },
  ]
  const hasData = filteredData.length > 5 

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl text-black font-bold">Question Table</h1>
        <div className="flex gap-3 relative">
          <button
            onClick={() => {
              setShowModal(true)
              setIsEdit(false)
            }}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            + Add
          </button>

          <button
            onClick={() => setShowFilter(!showFilter)}
            className="bg-gray-200 p-2 rounded hover:bg-gray-300"
          >
            <Filter size={18} className="text-black"/>
          </button>

          {showFilter && (
            <div className="absolute top-12 right-0 bg-white shadow-lg border rounded p-4 w-56 z-50">

              <div className="mb-3">
                <label className="text-sm text-black font-medium">Model</label>
                <select
                  value={modelFilter}
                  onChange={(e) => setModelFilter(e.target.value)}
                  className="w-full border px-2 py-1 rounded mt-1"
                >
                  <option value="">All</option>
                  {models.map((m, i) => (
                    <option key={i} value={m}>
                      Model {m}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mb-3">
                <label className="text-sm text-black font-medium">Difficulty</label>
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="w-full border px-2 py-1 rounded mt-1"
                >
                  <option value="">All</option>
                  {difficulties.map((d, i) => (
                    <option key={i} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={() => {
                  setModelFilter("")
                  setDifficultyFilter("")
                }}
                className="w-full text-white bg-blue-500 hover:bg-blue-600 py-1 rounded"
              >
                Reset
              </button>

            </div>
          )}

        </div>
      </div>
      <ReusableTable
        columns={columns}
        data={filteredData}
        pagination={true}
        hasData={hasData}
        actions={(row: any) => {
          const index = filteredData.findIndex((u) => u.id === row.id)
          return (
            <div className="flex gap-2 justify-center bg-white">
              <button onClick={() => handleEdit(index)} className="bg-white">
                <Pencil size={18} className="text-blue-500 " />
              </button>

              <button
                onClick={() => {
                  setDeleteIndex(index)
                  setShowDeleteModal(true)
                }} className="bg-white"
              >
                <Trash2 size={18} className="text-red-500" />
              </button>
            </div>
          )
        }}
      />
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="mb-3 text-black font-semibold">
              {isEdit ? "Edit Question" : "Add Question"}
            </h2>

            <textarea
              placeholder="Question"
              value={formData.question}
              onChange={(e) =>
                setFormData({ ...formData, question: e.target.value })
              }
              className="w-full border rounded p-2 mb-2"
            />

            <select
              value={formData.difficulty}
              onChange={(e) =>
                setFormData({ ...formData, difficulty: e.target.value })
              }
              className="w-full border rounded p-2 mb-2"
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>

            <textarea
              placeholder="Answer"
              value={formData.answer}
              onChange={(e) =>
                setFormData({ ...formData, answer: e.target.value })
              }
              className="w-full border rounded p-2 mb-3"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 bg-red-500 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleSubmit}
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                {isEdit ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-5 rounded w-72">
            <h2 className="mb-4 text-black">Are you sure you want delete this Question ?</h2>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-3 py-1 bg-red-500 rounded"
              >
                No
              </button>

              <button
                onClick={handleDelete}
                className="px-3 py-1 bg-green-500 text-white rounded"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default QuestionPage