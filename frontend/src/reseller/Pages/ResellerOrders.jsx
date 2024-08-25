import Orders from "../Specific/Order/Orders"
import SearchBar from "../Specific/Order/SearchBar"

const ResellerOrders = () => {
  return (
    <div  className="p-5 ">
      <SearchBar/>
      <Orders/>
    </div>
  )
}

export default ResellerOrders