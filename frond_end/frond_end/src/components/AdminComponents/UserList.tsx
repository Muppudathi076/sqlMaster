import { useEffect, useState } from "react"
import { Trash2 } from "lucide-react"
import ReusableTable from "../ReusableComponents/ReusableTable"
import { UserGetAllApi,UserdeleteByIdApi } from "../../auth/AdminAuthApi"
import toast from "react-hot-toast"

type User = {
  name: string
  score: number
  model: string
  active: string
}

function UserList() {

  const [users, setUsers] = useState<User[]>([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
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

  console.log("selectedUserId out side",selectedUserId)
  const handleDeleteUser = async() => {
      try{
        console.log("selectedUserId",selectedUserId)
        if (!selectedUserId) return
        await UserdeleteByIdApi(selectedUserId,token)
        toast.success("Delete Successfully",{duration:2000})
        setUsers((prev: any[]) =>
          prev.filter(user => user.id !== selectedUserId)
        )
        setShowDeleteModal(false)
        setSelectedUserId(null)
      }catch (err) {
    console.error(err)
    toast.error("Some Went wrong",{duration:200})
  }
    
  }

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Score", accessor: "score" },
    { header: "Current Model", accessor: "model" },
    { header: "Time", accessor: "total_time" },
  ]
  const token = localStorage.getItem("access_token") || ""
  const fetching_data = async()=>{
    try{
        const res = await UserGetAllApi(token)
        setUsers(res.data)
        const userData = res?.data || []  
        console.log("userData",userData)
        setUsers(Array.isArray(userData) ? userData : [])
      }catch(e){
      toast.error("Something Went Wrong",{duration:2000})

    }
  }

useEffect (()=>{
  fetching_data()
},[])

  return (
    <div className="p-4">

      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl text-black font-bold">User List</h1>

        {/* <button
          onClick={() => setShowAddModal(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Add User
        </button> */}
      </div>

      <ReusableTable columns={columns} data={users} height="320px" pagination={true} 
      actions={(row: any) => (
    <button
      onClick={(e) => {
        e.stopPropagation()
        setSelectedUserId(row.id)
        setShowDeleteModal(true)
      }}
      className="text-red-500 bg-white hover:scale-110"
    >
      <Trash2 size={18} />
    </button>
  )}/>

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
                <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">

          <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-6 rounded-lg w-80 shadow-lg">

            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to delete this user?
            </h2>

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  handleDeleteUser()
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
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