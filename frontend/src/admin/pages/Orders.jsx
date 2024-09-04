import  { useState, useEffect } from 'react';
import { fetchOrders } from '../Api/getApi';
import ManageOrders from '../specific/Orders/ManageOrders';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const data = await fetchOrders();
        console.log(data);
        
        setOrders(data.ordersNotCompleted);
      } catch (err) {
        setError(err.message || 'Failed to fetch orders');
      } finally {
        setLoading(false);
      }
    };

    getOrders();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <ManageOrders orders={orders}/>
    </div>
  );
};

export default Orders;
