import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { useNavigate } from 'react-router-dom';
import { fetchOrders } from '../../Api/getApi';

const columns = [
  {
    title: 'date',
    dataIndex: 'date',

    filterMode: 'tree',
    filterSearch: true,
    onFilter: (value, record) => record.name.includes(value),
    width: '30%',
  },
  {
    title: 'Product Count',
    dataIndex: 'productCount',
    sorter: (a, b) => a.age - b.age,
  },
  {
    title: 'Order Id',
    dataIndex: 'id',
   
    onFilter: (value, record) => record.address.startsWith(value),
    filterSearch: true,
    width: '40%',
  },
];


const onChange = (pagination, filters, sorter, extra) => {
  console.log('params', pagination, filters, sorter, extra);
};

const DateByGroup = () => {
    const [data, setData] = useState([])
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPreviousOrders = async () => {
      try {
        const response =  fetchOrders()
        const data = await response;
        console.log('Fetched data:', data);
        setData(data.orders)
        // Set data to state if needed
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchPreviousOrders();
  }, []);

  // Handle row click to navigate to a different page
  const onRowClick = (record) => {
    navigate(`/reseller/previous-order/${record.id}`); // Replace with the actual route and parameter
  };

  return (
    <Table
      columns={columns}
      className='w-full'
      dataSource={data}
      onChange={onChange}
      onRow={(record) => {
        return {
          onClick: () => onRowClick(record), // Click event for each row
        };
      }}
    />
  );
};

export default DateByGroup;
