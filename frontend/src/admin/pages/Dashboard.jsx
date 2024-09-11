import React, { useEffect, useState } from 'react';
import OrderLists from '../specific/OrderLists';
import OrderSummary from '../specific/OrderSummery';
import { dashboard } from '../Api/getApi';
import { Statistic } from 'antd';
import Statistics from '../specific/dashboard/statistics';
import Graph from '../specific/dashboard/Graph';

const Dashboard = () => {
  const [graphData, setgraphData] = useState([]);
  const [status,setStatus] = useState([])
  const [item, setItem] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dashboard();
        console.log('response', response);
        setgraphData(response.graphData)

        setStatus(response.statusData)
      } catch (error) {
        console.log('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);


  return (
    <div className=''>
      <Statistics status={status} />
      <Graph graphData={graphData}/>
    </div>
  );
};

export default Dashboard;
