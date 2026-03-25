import { useEffect, useState } from "react"
import { Pencil, Trash2 } from "lucide-react"
import ReusableTable from "../ReusableComponents/ReusableTable"
import toast from "react-hot-toast"
import { questionapiApi } from "../../auth/authapi"
import { useParams } from "react-router-dom"

function QuestionPage() {

  const { id } = useParams()
  const token = localStorage.getItem("access_token") || ""

  const [questions, setQuestions] = useState<any[]>([])
  const [selectedRows, setSelectedRows] = useState<number[]>([])

  const [showModal, setShowModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [editIndex, setEditIndex] = useState<number | null>(null)

  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null)

  const [formData, setFormData] = useState({
    question: "",
    difficulty: "easy",
    answer: "",
  })

  // 🔥 API FETCH
  const fetching = async () => {
    if (!id) return
    try {
      const response = await questionapiApi(Number(id), token)
      setQuestions(response)
    } catch (e) {
      console.log("API Error:", e)
      toast.error("Something went wrong")
    }
  }

  useEffect(() => {
    fetching()
  }, [id])

  // ➕ ADD / EDIT SUBMIT
  const handleSubmit = () => {
    if (isEdit && editIndex !== null) {
      const updated = [...questions]
      updated[editIndex] = {
        ...updated[editIndex],
        ...formData,
      }
      setQuestions(updated)
      toast.success("Question updated")
    } else {
      setQuestions([
        ...questions,
        {
          ...formData,
          model_no: id,
        },
      ])
      toast.success("Question added")
    }

    setShowModal(false)
    setFormData({ question: "", difficulty: "easy", answer: "" })
    setIsEdit(false)
  }

  // ✏️ EDIT
  const handleEdit = (index: number) => {
    const q = questions[index]
    setFormData({
      question: q.question,
      difficulty: q.difficulty,
      answer: q.answer,
    })
    setEditIndex(index)
    setIsEdit(true)
    setShowModal(true)
  }

  // ❌ DELETE
  const handleDelete = () => {
    if (deleteIndex !== null) {
      const updated = questions.filter((_, i) => i !== deleteIndex)
      setQuestions(updated)
      toast.success("Deleted successfully")
      setShowDeleteModal(false)
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

  // 📊 TABLE COLUMNS
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
    {
      header: "Action",
      accessor: "action",
      cell: (_: any, index: number) => (
        <div className="flex gap-2">
          <button onClick={() => handleEdit(index)}>
            <Pencil size={18} className="text-blue-500" />
          </button>
          <button
            onClick={() => {
              setDeleteIndex(index)
              setShowDeleteModal(true)
            }}
          >
            <Trash2 size={18} className="text-red-500" />
          </button>
        </div>
      ),
    },
  ]

  return (
    <div className="p-4">

      {/* 🔥 HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl text-black font-bold">Question Table</h1>

        <button
          onClick={() => {
            setShowModal(true)
            setIsEdit(false)
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          + Add
        </button>
      </div>

      {/* 📊 TABLE */}
      <ReusableTable columns={columns} data={questions} />

      {/* ➕ ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96">
            <h2 className="mb-3 font-semibold">
              {isEdit ? "Edit Question" : "Add Question"}
            </h2>

            <textarea
              placeholder="Question"
              value={formData.question}
              onChange={(e) =>
                setFormData({ ...formData, question: e.target.value })
              }
              className="w-full border p-2 mb-2"
            />

            <select
              value={formData.difficulty}
              onChange={(e) =>
                setFormData({ ...formData, difficulty: e.target.value })
              }
              className="w-full border p-2 mb-2"
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
              className="w-full border p-2 mb-3"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 bg-gray-300 rounded"
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

      {/* ❌ DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-5 rounded w-72">
            <h2 className="mb-4">Are you sure?</h2>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                No
              </button>

              <button
                onClick={handleDelete}
                className="px-3 py-1 bg-red-500 text-white rounded"
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