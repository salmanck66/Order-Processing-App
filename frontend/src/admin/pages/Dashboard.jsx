import  { useState } from 'react';
import OrderLists from '../specific/OrderLists';
import OrderSummary from '../specific/orderSummery';
const Dashboard = () => {
  const [item, setItem] = useState(0);

  const data = [
    {
      name: 'Fahiz',
      count: 34,
      orders: [
        {
          id: 1,
          productName: 'Barca',
          price: 1000,
          size: 'M',
          quantity: 10,
          status: 'Order'
        }
      ]
    },
    {
      name: 'Faiz',
      count: 34
    }
  ];

  // Ensure item is within the bounds of the data array
  const currentItem = data[item] || {};

  return (
    <div className='grid grid-cols-3 gap-4'>
      <OrderLists data={data} setItem={setItem} />
      <OrderSummary data={currentItem} />
    </div>
  );
}

export default Dashboard;
