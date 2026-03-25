import { useState,useEffect  } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import Sidebar from "../components/Sidebar"
import toast from "react-hot-toast"
import Navbar from "../components/Navbar"

function DashboardLayout() {

  const navigate = useNavigate()

  const [isOpen] = useState(true)
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const role = localStorage.getItem("role") || ""
  const handleLogout = () => {
    localStorage.removeItem("access_token")
    navigate("/")
    toast.success("Logout successfully", { duration: 2000 })
  }

useEffect(() => {
  if (darkMode) {
    document.documentElement.classList.add("dark")
  } else {
    document.documentElement.classList.remove("dark")
  }
}, [darkMode])
const toggleTheme = () => {
  console.log("toggle clicked")
  setDarkMode(prev => !prev)
}
  return (
    <div className="h-screen bg-white dark:bg-black transition-colors duration-300">

      {role === "user" && (
        <Sidebar
          isOpen={isOpen}
          isCollapsed={isCollapsed}
          openLogout={() => setShowLogoutModal(true)}
          toggleTheme={toggleTheme}
          setIsCollapsed={setIsCollapsed}
          darkMode={darkMode}
        />

      )}
      {role === "admin" && (
        <Navbar toggleSidebar={() => {}} openLogout={() => setShowLogoutModal(true)}/>
      )}
        <div
          className={`flex flex-col h-full transition-all duration-500 ease-in-out 
            ${
              role === "user"
                ? isOpen
                  ? isCollapsed
                    ? "ml-20"
                    : "ml-64"
                  : "ml-0"
                : "ml-0"
            }`}
        >
        <div className="p-2 overflow-auto bg-gray-100 dark:bg-gray-800 flex-1">
          <Outlet />
        </div>
      </div>


      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">

          <div className="bg-white dark:bg-gray-800 text-black dark:text-white p-6 rounded-lg w-80 shadow-lg">

            <h2 className="text-lg font-semibold mb-4">
              Are you sure you want to logout?
            </h2>

            <div className="flex justify-end gap-3">

              <button
                onClick={() => setShowLogoutModal(false)}
                className="px-4 py-2 bg-gray-300 dark:bg-gray-600 rounded hover:bg-gray-400 dark:hover:bg-gray-500"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  setShowLogoutModal(false)
                  handleLogout()
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

export default DashboardLayout