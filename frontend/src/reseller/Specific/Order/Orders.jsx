import React from 'react';
import { useSelector } from 'react-redux';
import Order from './Order';
import { Button, notification } from 'antd';
import { submitorder } from '../../Api/PostApi';

const Orders = () => {
  const orders = useSelector(state => state.orders.orders);

  const onSubmit = async () => {
    console.log(orders);
    const orderDetails = [];
    
    orders.forEach(order => {
      const data = {
        orderSizes: order.OrderSizes,
        productId: order._id
      };
      orderDetails.push(data);
    });


    try {
      const response = await submitorder(orderDetails);
      notification.success({
        message: 'Order Submitted',
        description: 'Your order has been successfully submitted!',
      });
      console.log(response);
    } catch (error) {
      notification.error({
        message: 'Submission Failed',
        description: 'There was an error submitting your order. Please try again.',
      });
      console.error(error);
    }
  };

  return (
    <div className="p-4 sm:p-10 flex flex-col">
      {orders.map((order, index) => (
        <Order key={index} index={index} product={order} />
      ))}
      <Button className='w-fit ms-auto' onClick={onSubmit}>
        Submit
      </Button>
    </div>
  );
};

export default Orders;
