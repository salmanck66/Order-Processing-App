import { Button, Divider, notification } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { submitorder } from "../../Api/PostApi";
import { submitCustomers } from "../../Redux/ordersSlice";
const CustomerCheckout = () => {
  const dispatch = useDispatch();
  const { totalCustomers, totalPrice, totalProducts, customer } = useSelector(state => state.orders);
  
  const handleSubmit = async () => {
    try {
      // Assuming submitorder is an async function that sends the order data
      const response = await submitorder(customer);
      console.log(response);
      
      // Check the response to see if the order submission was successful
        notification.success({
          message: 'Order Submitted',
          description: 'Your order has been submitted successfully!',
        });
        dispatch(submitCustomers())
     
    } catch (error) {
      notification.error({
        message: 'Submission Error',
        description: 'There was an error submitting your order. Please try again.',
      });
    }
  };

  return (
    <div className="bg-white shadow-xl w-full h-fit rounded-lg col-span-3 p-3 px-5">
      <div className="w-full flex ">
        <h1 className="text-sm text-gray-400 w-full">
          Customers
        </h1>
        <h2 className="ms-auto text-gray-600">{totalCustomers}</h2>
      </div>

      <div className="w-full flex ">
        <h1 className="text-sm text-gray-400 w-full">
          Total Products
        </h1>
        <h2 className="ms-auto text-gray-600">{totalProducts}</h2>
      </div>
      <Divider />

      <div className="w-full flex ">
        <h1 className="text-sm text-gray-400 w-full">
          Total
        </h1>
        <h2 className="ms-auto text-gray-600">{totalPrice}</h2>
      </div>
      <Button type="dashed" className="w-full my-2 bg-blue-400" onClick={handleSubmit}>
        Submit Orders
      </Button>
    </div>
  );
};

export default CustomerCheckout;
