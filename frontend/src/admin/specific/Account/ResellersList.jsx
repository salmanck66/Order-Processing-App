import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { fetchResellers } from '../../Api/getApi';

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
        const data = await fetchResellers(); // Update API call if necessary for pagination
        console.log(data.resellers);

        setResellers(data.resellers);
        setPagination({
          ...pagination,
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
