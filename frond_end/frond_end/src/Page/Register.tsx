import { useEffect, useState } from "react"
import { Validation } from "../utils/validation"
import Input from "../components/ReusableComponents/InputFields"
import {useNavigate} from "react-router-dom"
import { registerApi } from "../auth/authapi"
import toast from "react-hot-toast"

interface ErrorType {
  fullname?: string
  email?: string
  password?: string
}

function Register(){
    const [email, setEmail]=useState("")
    const [password, setPassword]=useState("")
    const [fullname, setFullname]=useState("")
    const [error,setError] = useState<ErrorType>({})
    const [message, setMessage]=useState("")

    const navigate = useNavigate()

    const handlesubmit = async(e:React.FormEvent) => {
        e.preventDefault()
        setError({})
        setMessage("")
        const validationErrors = Validation(email, password, fullname)

        if (Object.keys(validationErrors).length > 0) {

        Object.values(validationErrors).forEach((msg) => {
            toast.error(msg)
        })

        setError(validationErrors)
        return
        }
        try{
            const response = await registerApi(fullname,email,password) 
            console.log("role:",response.role)
            navigate('/')
            toast.success("login success",{duration:2000})
            setMessage("Login successfull")

        }catch(err : any){
            if (err.response && err.response.data) {
            const apiError = err.response.data
            const message =
                apiError.Email?.[0] ||
                apiError.Password?.[0] ||
                "Something went wrong"

            toast.error(message, { duration: 2000 })
            } else {
            toast.error("Something went wrong")
            }
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
            <h2 className="text-2xl text-black font-bold mb-6 text-center">Create an account</h2>
                {message && (
                    <p className="text-green-600 text-center mb-4">{message}</p>
                )}
                <div className="mb-4 w-full">
                    <Input
                    type="fullname"
                    placeholder="Enter Name"
                    value={fullname}
                    onchange={(e)=> setFullname(e.target.value)}/>
                    {error.email && (
                        <p className="text-red-500 text-sm">{error.fullname}</p>
                    )}
                </div>
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
                    {error.password && (
                        <p className="text-red-500 text-sm">{error.password}</p>
                    )}
                </div>
                <button
                type="submit"
                className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600"
                >Submit</button>
                <div className="flex justify-center mt-5">
                    <a href="/">Login Page</a>
                </div>
            </form>
        </div>
    )
}
export default Register