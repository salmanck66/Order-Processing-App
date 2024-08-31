import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Order from "./Order";
import { Button, Divider, notification } from "antd";
import { submitorder } from "../../Api/PostApi";
import { clearOrders } from "../../Redux/ordersSlice";
import { LuIndianRupee } from "react-icons/lu";

const Orders = () => {
  const { orders, totalPrice, totalQuantity } = useSelector(
    (state) => state.orders
  );
  const dispatch = useDispatch();

  const onSubmit = async () => {
    console.log(orders);
    const orderDetails = orders.map((order) => ({
      orderSizes: order.OrderSizes,
      productId: order._id,
    }));

    try {
      const response = await submitorder(orderDetails);

      if (response.status === 201) {
        notification.success({
          message: "Order Placed",
          description: "Your order has been successfully placed!",
        });
      } else if (response.status === 200) {
        notification.success({
          message: "Order Updated",
          description: "Your order has been successfully updated!",
        });
      }

      dispatch(clearOrders());
    } catch (error) {
      if (error.response && error.response.status === 403) {
        notification.error({
          message: "Order Time Restriction",
          description: "Orders can only be placed between 8 PM and 12 PM.",
        });
      } else if (error.response && error.response.status === 404) {
        notification.error({
          message: "Reseller Not Found",
          description: "Reseller not found. Please check your details and try again.",
        });
      } else {
        notification.error({
          message: "Submission Failed",
          description: error.message || "There was an error submitting your order. Please try again.",
        });
      }
      console.error("Submission error:", error);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 sm:p-5">
      <div className="flex flex-col flex-grow my-2">
        {orders.length > 0 ? orders.map((order, index) => (
          <Order key={index} index={index} product={order} />
        )) : (
          <div className="text-center text-lg font-bold text-gray-500 justify-center bg-white shadow-lg rounded-md flex flex-col">
            Your cart is empty!
            <img src="https://www.englishbrowne.com/front/assets/images/cart-empty.png" className="max-h-[400px] object-cover" alt="Empty Cart" />
          </div>
        )}
      </div>
      <div className="bg-white shadow-lg p-4 md:p-5 w-full md:w-80 h-fit sticky top-4 rounded-lg">
        <div className="border border-black p-2 rounded-md">
          <h3 className="text-sm font-mono font-thin">Order Summary</h3>
          <h4 className="text-sm font-extralight w-full flex justify-between">
            Total Quantity
            <span>{totalQuantity}</span>
          </h4>
          <h4 className="text-sm font-extralight w-full flex justify-between">
            Total Items
            <span>{orders.length}</span>
          </h4>
          <Divider className="my-2" />
          <h4 className="text-sm font-extralight w-full flex justify-between">
            Total Price
            <span>{totalPrice}</span>
          </h4>
        </div>
        <Button
          className="mt-4 w-full flex items-center justify-center"
          type="primary"
          onClick={onSubmit}
        >
          Submit Order <LuIndianRupee className="ml-2" />{totalPrice}
        </Button>
      </div>
    </div>
  );
};

export default Orders;
