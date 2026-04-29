import { useState, useEffect } from "react"
import { Outlet, useNavigate, NavLink, useLocation } from "react-router-dom"
import toast from "react-hot-toast"
import { logoutApi } from "../auth/authapi"
import { Sun, Moon, LayoutDashboard, Boxes, Users, LogOut, Menu, X } from "lucide-react"

function DashboardLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark"
  })

  const role = localStorage.getItem("role") || ""
  const userName = localStorage.getItem("user") || ""

  const isQuestionPage = location.pathname.includes("/api/modal/") || location.pathname.includes("/admin/modalpage/");

  const handleLogout = async() => {
    const token = localStorage.getItem("access_token") || ""
    try{
      await logoutApi(token)
      localStorage.removeItem("access_token")
    }catch(e:any){
      console.log("logout api :",e)
    }
    navigate("/")
    toast.success("Logout successfully", { duration: 2000 })
    localStorage.removeItem("access_token")
  }

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev)
  }

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
    } else {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
    }
  }, [darkMode])

  const adminMenu = [
    { name: "Dashboard", path: "admin/dashboard", icon: LayoutDashboard },
    { name: "User List", path: "admin/userlist", icon: Users },
    { name: "Models", path: "admin/modalpage", icon: Boxes },
  ]
  const userMenu = [
    { name: "Dashboard", path: "/api/dashboard", icon: LayoutDashboard },
    { name: "Models", path: "/api/model", icon: Boxes }
  ]

  const menuItems = role === "admin" ? adminMenu : userMenu

  return (
    <div className="h-screen bg-white dark:bg-black transition-colors duration-500 flex overflow-hidden">
      
      {(role === "user" || role === "admin") && !isQuestionPage && (
        <aside className="hidden lg:flex flex-col w-64 bg-white/5 dark:bg-zinc-900/10 backdrop-blur-xl border-r border-gray-200 dark:border-zinc-800 h-full relative z-50 animate-in fade-in slide-in-from-left duration-500">
          <div className="p-6">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Tiny Todds
            </h1>
          </div>

          <div className="flex-1 px-4 space-y-2 py-4">
            <p className="px-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
              Main Menu
            </p>
            {menuItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group relative
                  ${isActive 
                    ? "bg-blue-500/10 text-blue-500 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]" 
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800/50 hover:text-blue-500"}`
                }
              >
                <item.icon size={20} className="transition-transform group-hover:scale-110" />
                <span className="font-medium">{item.name}</span>
                <div className="absolute left-0 w-1 h-6 bg-blue-500 rounded-r-full scale-y-0 group-[.active]:scale-y-100 transition-transform duration-300" />
              </NavLink>
            ))}
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-zinc-800 space-y-4">
            <div className="px-4 py-3 bg-blue-500/5 dark:bg-blue-500/10 border border-blue-500/10 rounded-2xl">
              <p className="text-[10px] text-gray-400 uppercase tracking-tighter">Account</p>
              <p className="font-bold text-sm text-black dark:text-white truncate">{userName}</p>
            </div>
            
            <button
              onClick={() => setShowLogoutModal(true)}
              className="flex items-center gap-3 w-full px-4 py-3 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-all duration-300 font-medium"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </aside>
      )}

      {(role === "user" || role === "admin") && !isQuestionPage && (
        <div className="lg:hidden fixed top-0 left-0 right-0 z-[60] bg-white/5 dark:bg-black/20 backdrop-blur-xl border-b border-gray-200 dark:border-zinc-800 px-4 py-3 flex items-center justify-between">
           <h1 className="text-xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
              Tiny Todds
            </h1>
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600 dark:text-gray-300"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
        </div>
      )}

      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[55] bg-white dark:bg-black pt-20 px-6 space-y-4">
           {menuItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-4 p-4 rounded-2xl
                  ${isActive ? "bg-blue-500 text-white shadow-lg" : "text-gray-600 dark:text-gray-300"}`
                }
              >
                <item.icon size={22} />
                <span className="text-lg font-medium">{item.name}</span>
              </NavLink>
            ))}
            <button
              onClick={() => {
                setMobileMenuOpen(false)
                setShowLogoutModal(true)
              }}
              className="flex items-center gap-4 p-4 w-full text-red-500"
            >
              <LogOut size={22} />
              <span className="text-lg font-medium">Logout</span>
            </button>
        </div>
      )}

      <main className={`flex-1 flex flex-col min-w-0 h-full relative ${isQuestionPage ? 'pt-0' : 'pt-16 lg:pt-0'}`}>
        <div className="flex-1 overflow-auto bg-transparent relative z-10">
          <Outlet />
        </div>
      </main>

      <button
        onClick={toggleDarkMode}
        className={`fixed ${isQuestionPage ? 'bottom-32' : 'bottom-6'} right-6 z-[70] w-14 h-14 rounded-full shadow-lg hover:scale-110 active:scale-90 transition-all duration-500 flex items-center justify-center ${
          darkMode
            ? "bg-gradient-to-r from-indigo-600 to-blue-700 shadow-[0_4px_20px_rgba(99,102,241,0.5)]"
            : "bg-gradient-to-r from-amber-400 to-orange-500 shadow-[0_4px_20px_rgba(251,191,36,0.5)]"
        }`}
      >
        <div className={`transition-transform duration-500 ${darkMode ? "rotate-[360deg]" : "rotate-0"}`}>
          {darkMode ? <Moon size={24} className="text-white" /> : <Sun size={24} className="text-white" />}
        </div>
      </button>

      {showLogoutModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm z-[100]">
          <div className="bg-white dark:bg-zinc-900 text-black dark:text-white p-8 rounded-3xl w-[90%] max-w-sm shadow-2xl border border-gray-200 dark:border-zinc-800">
            <h2 className="text-xl font-bold mb-2">Ready to leave?</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">We'll save your progress for next time!</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => {
                  setShowLogoutModal(false)
                  handleLogout()
                }}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-red-600/20"
              >
                Yes, Log Out
              </button>
              <button
                onClick={() => setShowLogoutModal(false)}
                className="w-full py-3 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-xl font-bold transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default DashboardLayout