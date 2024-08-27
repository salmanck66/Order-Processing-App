import React, { useEffect } from 'react';
import { Table } from 'antd';
import { useNavigate } from 'react-router-dom';
import { fetchOrders } from '../../Api/getApi';

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    filters: [
      {
        text: 'Joe',
        value: 'Joe',
      },
      {
        text: 'Category 1',
        value: 'Category 1',
        children: [
          {
            text: 'Yellow',
            value: 'Yellow',
          },
          {
            text: 'Pink',
            value: 'Pink',
          },
        ],
      },
      {
        text: 'Category 2',
        value: 'Category 2',
        children: [
          {
            text: 'Green',
            value: 'Green',
          },
          {
            text: 'Black',
            value: 'Black',
          },
        ],
      },
    ],
    filterMode: 'tree',
    filterSearch: true,
    onFilter: (value, record) => record.name.includes(value),
    width: '30%',
  },
  {
    title: 'Age',
    dataIndex: 'age',
    sorter: (a, b) => a.age - b.age,
  },
  {
    title: 'Address',
    dataIndex: 'address',
    filters: [
      {
        text: 'London',
        value: 'London',
      },
      {
        text: 'New York',
        value: 'New York',
      },
    ],
    onFilter: (value, record) => record.address.startsWith(value),
    filterSearch: true,
    width: '40%',
  },
];

const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
  },
  {
    key: '4',
    name: 'Jim Red',
    age: 32,
    address: 'London No. 2 Lake Park',
  },
];

const onChange = (pagination, filters, sorter, extra) => {
  console.log('params', pagination, filters, sorter, extra);
};

const DateByGroup = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPreviousOrders = async () => {
      try {
        const response =  fetchOrders()
        const data = await response;
        console.log('Fetched data:', data);
        // Set data to state if needed
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchPreviousOrders();
  }, []);

  // Handle row click to navigate to a different page
  const onRowClick = (record) => {
    navigate(`/reseller/previous-order/${record.key}`); // Replace with the actual route and parameter
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
