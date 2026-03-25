import { useEffect, useState } from "react"
import { Validation } from "../utils/validation"
import Input from "../components/ReusableComponents/InputFields"
import {useNavigate} from "react-router-dom"
import { loginApi } from "../auth/authapi"
import toast from "react-hot-toast"

interface ErrorType {
  email?: string
  password?: string
}

function Login(){
    const [email, setEmail]=useState("")
    const [password, setPassword]=useState("")
    const [error,setError] = useState<ErrorType>({})

    const navigate = useNavigate()

    const handlesubmit = async(e:React.FormEvent) => {
        e.preventDefault()
        setError({})
        const validationErrors = Validation(email, password)

        if (Object.keys(validationErrors).length > 0) {

        Object.values(validationErrors).forEach((msg) => {
            toast.error(msg)
        })

        setError(validationErrors)
        return
        }
        try{
            const response = await loginApi(email,password) 
            console.log("role:",response.role)
            if (response.role === "admin") {
            navigate('/api/admin/dashboard')
            } else if (response.role === "user") {
            navigate('/api/dashboard')
            }
            // navigate('/api/')
            localStorage.setItem("access_token",response.access)
            localStorage.setItem("user",response.name)
            localStorage.setItem("email",response.admin_name)
            localStorage.setItem("role", response.role)
            toast.success("login success",{duration:2000})

        }catch(e){
            console.log("erorrs :",e)
            toast.error("Something thing wrong",{duration:2000})
        }
    }
    const token = localStorage.getItem("access_token")
useEffect(()=>{
    if(!token){
    navigate("/")
    }
},[])   
    return(
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-100">
            <form
            onSubmit={handlesubmit}
            className="bg-white p-8 rounded-xl shadow-lg w-96"
            >
            <h2 className="text-2xl text-black font-bold mb-6 text-center">Login</h2>
                <div className="mb-4 w-full">
                    <Input
                    type="email"
                    placeholder="Enter Email"
                    value={email}
                    onchange={(e)=> setEmail(e.target.value)}/>
                    {error.email && (
                        <p className="text-red-500 text-sm">{error.email}</p>
                    )}
                </div>
                <div className="mb-4 w-full">
                    <Input
                    type="password"
                    placeholder="Enter Password"
                    value={password}
                    onchange={(e)=>setPassword(e.target.value)}/>
                </div>
                <button
                type="submit"
                className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
                >Submit</button>
                <div className="flex justify-center mt-5 text-black">
                    <a href="/register">Register</a>
                </div>
            </form>
        </div>
    )
}
export default Login