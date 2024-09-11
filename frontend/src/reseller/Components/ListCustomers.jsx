import React, { useState } from 'react';
import { Table, Pagination, Spin, Empty, DatePicker } from 'antd';
import 'antd/dist/reset.css'; // Import Ant Design styles
import Information from './information';
import { getCustomersByDate } from '../Api/getApi';

const ListCustomers = ({ customers, setCustomers, loading, resetCustomers }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Define columns for the table
  const columns = [
    {
      title: 'Order Date',
      dataIndex: 'Date',
      key: 'Date',
    },
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
      responsive: ['sm'],
    },
  ];

  // Slice data for current page
  const paginatedData = customers.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  // Handle date picker change
  const onChange = async (date, dateString) => {
    if (!date) {
      // If no date is selected, reset the customer data to the original list
      resetCustomers();
      setCurrentPage(1);  // Reset pagination
      return;
    }

    try {
      const data = await getCustomersByDate(dateString);
      setCustomers(data); // Update customers state with the filtered data
      setCurrentPage(1);  // Reset pagination when new data is loaded
    } catch (error) {
      console.error('Failed to fetch customers by date:', error);
    }
  };

  return (
    <div className="col-span-3 p-4 overflow-y-auto">
      <div className="flex justify-between h-full my-5 items-center">
        <h1 className="text-xl font-bold mb-4">
          Customers
          <Information tooltipMessage="This table currently shows customers from the past 5 days" />
        </h1>
        <div className="gap-2 flex h-full items-center">
          <label className="text-sm font-semibold">Filter by Date:</label>
          <DatePicker onChange={onChange} />
          <Information tooltipMessage="Choose a date to view customers from a specific day" />
        </div>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
          <span className="ml-2 text-lg">Loading customers...</span>
        </div>
      ) : customers.length === 0 ? (
        <Empty description="No customers found for the selected date range." />
      ) : (
        <>
          <Table
            dataSource={paginatedData}
            columns={columns}
            rowKey="_id"
            pagination={false} // Disable Ant Design's default pagination
            className="mb-4"
          />
          <div className="text-center">
            <span className="text-sm">
              Page {currentPage} of {Math.ceil(customers.length / pageSize)}
            </span>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={customers.length}
              onChange={handlePageChange}
              showSizeChanger={false}
              style={{ marginTop: 16 }}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default ListCustomers;
