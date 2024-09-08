import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
  { month: 'Jan', orders: 400, resellers: 30 },
  { month: 'Feb', orders: 300, resellers: 25 },
  { month: 'Mar', orders: 500, resellers: 40 },
  { month: 'Apr', orders: 450, resellers: 35 },
  { month: 'May', orders: 600, resellers: 45 },
  { month: 'Jun', orders: 700, resellers: 50 },
  { month: 'Jul', orders: 650, resellers: 48 },
  { month: 'Aug', orders: 800, resellers: 55 },
  { month: 'Sep', orders: 750, resellers: 52 },
  { month: 'Oct', orders: 850, resellers: 60 },
  { month: 'Nov', orders: 900, resellers: 65 },
  { month: 'Dec', orders: 950, resellers: 70 },
];

const Graph = () => {
  return (
    <ResponsiveContainer width="100%" className='sm:p-1 sm:py-2' height={400}>
      <LineChart
        data={data}
        margin={{
          top: 5, right: 30, left: 20, bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        
        {/* Line for Orders */}
        <Line 
          type="monotone" 
          dataKey="orders" 
          stroke="#8884d8" 
          activeDot={{ r: 8 }} 
          name="Total Orders"
        />
        
        {/* Line for Resellers */}
        <Line 
          type="monotone" 
          dataKey="resellers" 
          stroke="#82ca9d" 
          name="Total Resellers"
        />
        
      </LineChart>
    </ResponsiveContainer>
  );
};

export default Graph;
