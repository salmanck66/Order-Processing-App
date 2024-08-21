import React, { useEffect, useState } from 'react';
import OrderLists from '../specific/OrderLists';
import OrderSummary from '../specific/OrderSummery';
import { dashboard } from '../Api/getApi';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [item, setItem] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dashboard();
        console.log(response);
        // Assuming response is the data you need, set it to state
        // setData(response);
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Ensure item is within the bounds of the data array
  const currentItem = data[item] || {};

  return (
    <div className='grid grid-cols-3 gap-4'>
      {/* <OrderLists data={data} setItem={setItem} />
      <OrderSummary data={currentItem} /> */}
    </div>
  );
};

export default Dashboard;
