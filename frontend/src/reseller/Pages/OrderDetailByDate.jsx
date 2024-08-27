import { useEffect, useState } from "react";
import { fetchOrder } from "../Api/getApi";
import { useParams } from "react-router-dom";
const OrderDetailByDate = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const orderId = useParams().orderId;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchOrder(orderId); // Replace this with appropriate date parameters if needed
        setOrders(response.order);
        console.log(response);
        
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h2>Order Details</h2>
      {orders.length === 0 ? (
        <p>No orders found for the selected date.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            <li key={order.id}>{order.details}</li> 
          ))}
        </ul>
      )}
    </div>
  );
};

export default OrderDetailByDate;
