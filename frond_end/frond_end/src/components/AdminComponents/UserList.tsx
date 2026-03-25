import { useState } from "react"
import { Trash2 } from "lucide-react"
import ReusableTable from "../ReusableComponents/ReusableTable"

function UserList() {

  const [users, setUsers] = useState([
    { name: "Arun", score: 85, model: "Level 1", active: "Yes" },
    { name: "Priya", score: 92, model: "Level 2", active: "Yes" },
    { name: "Karthik", score: 70, model: "Level 1", active: "No" },
  ])

  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedUserIndex, setSelectedUserIndex] = useState<number | null>(null)

  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
  })
  const handleAddUser = () => {
    setUsers([
      ...users,
      {
        name: newUser.name,
        score: 0,
        model: "Level 1",
        active: "Yes",
      },
    ])
    setShowAddModal(false)
    setNewUser({ name: "", email: "", password: "" })
  }

  const handleDeleteUser = () => {
    if (selectedUserIndex !== null) {
      const updated = users.filter((_, i) => i !== selectedUserIndex)
      setUsers(updated)
      setShowDeleteModal(false)
    }
  }

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Score", accessor: "score" },
    { header: "Current Model", accessor: "model" },
    { header: "Active", accessor: "active" },
    {
      header: "Action",
      accessor: "action",
      cell: (_: any, index: number) => (
        <button
          onClick={() => {
            setSelectedUserIndex(index)
            setShowDeleteModal(true)
          }}
          className="text-red-500 hover:scale-110"
        >
          <Trash2 size={18} />
        </button>
      ),
    },
  ]

  return (
    <div className="p-4">

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl text-black font-bold">User List</h1>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Add User
        </button>
      </div>

      <ReusableTable columns={columns} data={users} />

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-80">
            <h2 className="font-semibold mb-3">Add User</h2>

            <input
              type="text"
              placeholder="Name"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              className="w-full border p-2 mb-2"
            />

            <input
              type="email"
              placeholder="Email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              className="w-full border p-2 mb-2"
            />

            <input
              type="password"
              placeholder="Password"
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              className="w-full border p-2 mb-3"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-3 py-1 bg-red-600 rounded"
              >
                Cancel
              </button>

              <button
                onClick={handleAddUser}
                className="px-3 py-1 bg-blue-500 text-white rounded"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-72">
            <h2 className="mb-4">Are you sure?</h2>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-3 py-1 bg-gray-300 rounded"
              >
                No
              </button>

              <button
                onClick={handleDeleteUser}
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

export default UserList