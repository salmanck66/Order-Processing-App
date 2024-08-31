import Orders from "../Specific/Order/Orders"
import SearchBar from "../Specific/Order/SearchBar"
import UploadCustomer from "../Specific/Order/OrdersList"
import OrderLists from "../../admin/specific/OrderLists"
import OrdersList from "../Specific/Order/OrdersList"

const ResellerOrders = () => {
  return (
    <div  className="p-5 ">
      {/* <SearchBar/>
      <Orders/> */}

      <OrdersList/>
    </div>
  )
}

export default ResellerOrders