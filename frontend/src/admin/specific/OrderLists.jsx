import { useState } from 'react';
import { Table } from 'antd';

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
  },
  {
    title: 'Order Count',
    dataIndex: 'count',
  },
];

const OrderLists = ({ data, setItem }) => {
  // onRow function to handle row selection
  const onRow = (record, rowIndex) => {
    return {
      onClick: () => {
        setItem(rowIndex);  // Set the selected row data
      },
    };
  };

  return <Table columns={columns} dataSource={data} onRow={onRow} />;
};

export default OrderLists;
