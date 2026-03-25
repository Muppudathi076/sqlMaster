import { useState } from "react"
import { NavLink } from "react-router-dom"
import { Menu, X, LogOut } from "lucide-react"

function Navbar({ openLogout }: any) {
  const userName = localStorage.getItem("user")
  const [mobileMenu, setMobileMenu] = useState(false)

  const adminMenu = [
    { name: "Dashboard", path: "admin/dashboard" },
    // { name: "Admin", path: "admin/create" },
    { name: "User List", path: "admin/userlist" },
    { name: "Models", path: "admin/modalpage" },
  ]

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md px-4 py-3 relative">

      <div className="flex items-center justify-between">

        <p className="text-lg sm:text-xl font-bold text-black dark:text-white">
          Tiny Todds
        </p>

        <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 gap-6">
          {adminMenu.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `text-sm font-medium transition-all duration-200
                ${isActive ? "text-blue-500" : "text-black dark:text-white"}
                hover:text-blue-500`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">

          <h3 className="hidden sm:block text-sm font-semibold text-black dark:text-white">
            Welcome {userName}
          </h3>

          <button
            onClick={openLogout}
            className="p-1 rounded bg-white text-black dark:bg-black shadow shadow-blue-500"
          >
            <LogOut size={18} />
          </button>

          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="md:hidden p-2"
          >
            {mobileMenu ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

      </div>

      {mobileMenu && (
        <div className="md:hidden mt-3 flex flex-col gap-3 bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
          {adminMenu.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              onClick={() => setMobileMenu(false)}
              className={({ isActive }) =>
                `p-2 rounded text-sm
                ${isActive ? "bg-blue-500 text-white" : "text-black dark:text-white"}
                hover:bg-blue-500 hover:text-white`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </div>
      )}

    </div>
  )
}

export default Navbar