import React from 'react';
import { useSelector } from 'react-redux';
import Order from './Order';

const Orders = () => {
  const orders = useSelector(state => state.orders.orders);

  return (
    <div className="p-4 sm:p-10 flex flex-col">
      {orders.map((order, index) => (
        <Order key={index} index={index} product={order} />
      ))}
    </div>
  );
};

export default Orders;
