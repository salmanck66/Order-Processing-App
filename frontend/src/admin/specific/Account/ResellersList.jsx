import React, { useEffect, useState } from 'react';
import { Button, Popconfirm, Table, message } from 'antd';
import { fetchResellers } from '../../Api/getApi'; // Assuming you have delete API
import { IoTrashBin } from 'react-icons/io5';
import { deleteReseller } from '../../Api/DeleteApi';

const ResellersList = () => {
  const [resellers, setResellers] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  useEffect(() => {
    const getResellers = async (page = 1, pageSize = 10) => {
      try {
        const data = await fetchResellers(page, pageSize);
        setResellers(data.resellers);
        setPagination({
          current: page,
          pageSize: pageSize,
          total: data.totalCount || data.resellers.length,
        });
      } catch (error) {
        console.error('Error fetching resellers:', error);
      }
    };

    getResellers(pagination.current, pagination.pageSize);
  }, [pagination.current, pagination.pageSize]);

  const handleTableChange = (pagination) => {
    setPagination({
      ...pagination,
      current: pagination.current,
      pageSize: pagination.pageSize,
    });
  };

  const handleDeleteReseller = async (id) => {
    try {
      await deleteReseller(id); // Assuming you have a delete API
      message.success('Reseller deleted successfully');
      setResellers(resellers.filter((reseller) => reseller._id !== id)); // Update the list
    } catch (error) {
      console.error('Error deleting reseller:', error);
      message.error('Failed to delete reseller');
    }
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Created At',
      dataIndex: 'createdAt',
      key: 'createdAt',
  
      render: (text) => (text ? new Date(text).toLocaleString() : 'N/A'),
      responsive: ['sm']
    },
    {
      title: 'Action',
      dataIndex: '',
      key: 'action',
      render: (record) => (
        <Popconfirm
          title="Are you sure you want to delete this reseller?"
          onConfirm={() => handleDeleteReseller(record._id)}
        >
          <Button type="" className='border-red-600'><IoTrashBin className='text-red-600' /></Button>
        </Popconfirm>
      ),
    },
  ];

  return (
    <div>
      <Table
        dataSource={resellers.map((reseller) => ({ ...reseller, key: reseller._id }))}
        columns={columns}
        pagination={pagination}
        onChange={handleTableChange}
        bordered
      />
    </div>
  );
};

export default ResellersList;
