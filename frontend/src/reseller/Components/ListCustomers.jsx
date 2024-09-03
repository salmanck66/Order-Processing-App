import React, { useState } from 'react';
import { Table, Pagination } from 'antd';
import 'antd/dist/reset.css'; // Import Ant Design styles

const ListCustomers = ({ customers }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Define columns for the table
  const columns = [
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Orders Count',
      dataIndex: 'orders',
      key: 'orders',
      render: (orders) => orders.length, // Display number of orders
    },
    {
      title: 'Label',
      dataIndex: 'label',
      key: 'label',
    },
  ];

  // Slice data for current page
  const paginatedData = customers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="col-span-3 p-4 overflow-y-scroll no-scrollbar ">
      <h1 className="text-xl font-bold mb-4">Customers</h1>
      <Table
        dataSource={paginatedData}
        columns={columns}
        rowKey="_id"
        pagination={false} // Disable Ant Design's default pagination
      />
      <Pagination
        current={currentPage}
        pageSize={pageSize}
        total={customers.length}
        onChange={handlePageChange}
        showSizeChanger={false}
        style={{ marginTop: 16, textAlign: 'center' }}
      />
    </div>
  );
};

export default ListCustomers;
