import { Outlet } from "react-router-dom"
import NavBar from "../Specific/NavBar"

const ProtectedRouteReseller = () => {
  return (
    <div className="flex flex-col  h-screen  bg-ternary  " >
        <NavBar/>
        <div className=" mx-1 rounded-lg rounded-t-none">
        <Outlet/>
        </div>
    </div>
  )
}

export default ProtectedRouteReseller