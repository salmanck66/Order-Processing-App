import { Divider } from "antd";

const CustomerCheckout = ( ) => {
    return (
      <div className="bg-white shadow-xl w-full rounded-lg col-span-3 p-3 px-5">
       <div className="w-full flex ">
       <h1 className="text-sm text-gray-400 w-full ">
          Customers 
        </h1>
        <h2 className="ms-auto text-gray-600">90</h2>
       </div>

       <div className="w-full flex ">
       <h1 className="text-sm text-gray-400 w-full ">
          Total Products  
        </h1>
        <h2 className="ms-auto text-gray-600">900</h2>
       </div>
       <Divider/>
      </div>
    );
  }
  
  export default CustomerCheckout;
  