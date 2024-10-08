import React, { useState, useEffect } from 'react';
import { fetchOrders } from '../Api/getApi';
import ManageOrders from '../specific/Orders/ManageOrders';
import { Empty } from 'antd'; // Import the Empty component from Ant Design

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [orderTotalLength, setOrderTotalLength] = useState(0);
  const [currentOrder, setCurrentOrder] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getOrders = async () => {
    try {
      setLoading(true);
      const data = await fetchOrders();
      console.log(data);
      setOrderTotalLength(data.data.totalOrdersToday);
      setCurrentOrder(data.currentOrder);
      setOrders(data.data.ordersNotCompleted);
      console.log(data.data.ordersNotCompleted);
    } catch (err) {
      setError(err.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  const handleNextReseller = async () => {
    // Trigger the fetchOrders function to get updated data
    await getOrders();
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {orders?.length === 0 ? (
        <Empty description="No orders available" />
      ) : (
        <ManageOrders
          orders={orders}
          currentOrder={currentOrder}
          orderTotalLength={orderTotalLength}
          onNextReseller={handleNextReseller} // Pass the callback function
        />
      )}
    </div>
  );
};

export default Orders;
