import React from 'react';
import { Table, Card } from 'antd';

const ManageOrders = ({ orders }) => {
  // Define columns for the orders table
  const columns = [
    {
      title: 'Product ID',
      dataIndex: 'productId',
      key: 'productId',
    },
    {
      title: 'Sizes & Quantities',
      dataIndex: 'orderSizes',
      key: 'orderSizes',
      render: (sizes) =>
        Object.entries(sizes).map(([size, quantity]) => (
          <div key={size}>
            {size}: {quantity}
          </div>
        )),
    },
  ];

  return (
    <div style={{ padding: '20px' }}>
      {orders.map((resellerOrder) => (
        <Card
          key={resellerOrder._id}
          title={`Reseller: ${resellerOrder.reseller.name}`}
          style={{ marginBottom: '20px' }}
        >
          {resellerOrder.customers.map((customer) => (
            <Card
              key={customer._id}
              title={`Customer: ${customer.customerName}`}
              style={{ marginBottom: '20px' }}
            >
              {customer.orders.length > 0 ? (
                <Table
                  dataSource={customer.orders}
                  columns={columns}
                  rowKey="_id"
                  pagination={false}
                />
              ) : (
                <p>No orders available</p>
              )}
              <p>Label: {customer.label}</p>
            </Card>
          ))}
        </Card>
      ))}
    </div>
  );
};

export default ManageOrders;
