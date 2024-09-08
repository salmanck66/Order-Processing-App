import React, { useState } from 'react';
import { Button, Divider, notification, Tooltip } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { submitorder } from '../../Api/PostApi';
import { submitCustomers } from '../../Redux/ordersSlice';
import useCheckoutStatus from '../../Utils/useCheckoutStatus';

const CustomerCheckout = () => {
  const dispatch = useDispatch();
  const { totalCustomers, totalPrice, totalProducts, customer } = useSelector((state) => state.orders);
  
  const [loading, setLoading] = useState(false);
  const status = useCheckoutStatus(); // Assuming status indicates whether it's okay to submit
  console.log(status);

  // Check if customer data is empty
  const handleSubmit = async () => {
    if (!customer || customer.length === 0) {
      notification.error({
        message: 'No Customer Data',
        description: 'Please add customer data before submitting the order.',
      });
      return;
    }

    setLoading(true); // Start loading
    try {
      const response = await submitorder(customer);
      console.log(response);

      notification.success({
        message: 'Order Submitted',
        description: 'Your order has been submitted successfully!',
      });

      // Dispatch an action to reset or submit customers
      dispatch(submitCustomers());
    } catch (error) {
      notification.error({
        message: 'Submission Error',
        description: 'There was an error submitting your order. Please try again.',
      });
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="bg-white shadow-xl w-[345px] border-2 h-fit md:col-span-3 col-span-1 rounded-lg p-4 md:p-6 flex flex-col gap-4">
      <div className="flex justify-between w-full">
        <h1 className="text-sm text-gray-400">Customers</h1>
        <h2 className="text-gray-600">{totalCustomers}</h2>
      </div>

      <div className="flex justify-between w-full">
        <h1 className="text-sm text-gray-400">Total Products</h1>
        <h2 className="text-gray-600">{totalProducts}</h2>
      </div>
      
      <Divider />

      <div className="flex justify-between w-full">
        <h1 className="text-sm text-gray-400">Total</h1>
        <h2 className="text-gray-600">{totalPrice}</h2>
      </div>

      <Tooltip 
        title={
          status 
          ? 'Unable to submit. Ensure all customers have orders with valid sizes and quantities.' 
          : ''
        }
      >
        <Button
          type="primary"  // Changed to "primary" instead of "dashed" for better visual clarity
          className="w-full my-2 bg-blue-400 text-white hover:bg-blue-500 transition-all"
          onClick={handleSubmit}
          loading={loading} // Show loading spinner when true
          disabled={status || loading} // Disable if status indicates an issue or if already submitting
        >
          Submit Orders
        </Button>
      </Tooltip>
    </div>
  );
};

export default CustomerCheckout;
