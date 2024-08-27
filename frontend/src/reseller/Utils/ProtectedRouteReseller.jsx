import { Outlet } from "react-router-dom"
import NavBar from "../Specific/NavBar"

const ProtectedRouteReseller = () => {
  return (
    <div className="flex flex-col  h-screen  bg-white  " >
        <NavBar/>
        <div className=" mx-1 rounded-lg rounded-t-none overflow-y-scroll no-scrollbar">
        <Outlet/>
        </div>
    </div>
  )
}

export default ProtectedRouteReseller