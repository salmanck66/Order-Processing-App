import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const Graph = ({ graphData }) => {
  return (
    <ResponsiveContainer width="100%" className="sm:p-1 sm:py-2" height={400}>
      <LineChart
        data={[...graphData].reverse()}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
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
