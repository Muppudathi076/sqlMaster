import { Route,Routes } from "react-router-dom"
import Login from "./Page/Login"
import Register from "./Page/Register"
import { Toaster } from "react-hot-toast"
import ProtectedRoute from "./utils/ProtectedRoute"
import DashboardLayout from "./layout/DashboardLayout"
import Dashboard from "./Page/Dashboard"
import Model from "./Page/Model"
import UserProfile from "./Page/UserProfile"
import AdminDashboard from "./components/AdminComponents/Admindashboard"
import UserList from "./components/AdminComponents/UserList"
import QuestionPage from "./components/AdminComponents/QuestionPage"

function App() {
  return (
    <>
    <Toaster position="top-center" reverseOrder={false} />
    <Routes>
      <Route path='/register' element={<Register/>}/>
      <Route path='/' element={<Login/>}/>
      <Route path='/api' element={
        <ProtectedRoute>
          <DashboardLayout/>
        </ProtectedRoute>}>
          <Route path='dashboard' element={<Dashboard/>}/>
          <Route path='model/:id' element={<Model/>}/>
          <Route path='profile' element={<UserProfile/>}/>
          <Route path='admin/dashboard' element={<AdminDashboard/>}/>
          <Route path='admin/userlist' element={<UserList/>}/>
          <Route path='admin/modalpage' element={<QuestionPage/>}/>
      </Route>
    </Routes>
    </>
  )
}

export default App
