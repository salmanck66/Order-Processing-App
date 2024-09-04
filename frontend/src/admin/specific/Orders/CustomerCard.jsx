import React, { useState } from 'react';
import { Table, Card, Button, message, Checkbox } from 'antd';
import { IoPrintSharp } from "react-icons/io5";
import { GoFileSubmodule } from "react-icons/go";

const CustomerCard = ({ customer }) => {
  const [selectedSizes, setSelectedSizes] = useState(() => {
    const initialSizes = {};
    customer.orders.forEach((order) => {
      initialSizes[order.productId._id] = {};
      order.orderSizes.forEach(({ size }) => {
        initialSizes[order.productId._id][size] = true;
      });
    });
    return initialSizes;
  });

  const handleOrderDone = (customerId) => {
    console.log(`Order for customer ${customerId} is marked as done.`);
    message.success('Order marked as done successfully!');
    // Add any other logic here (e.g., update the order status in the backend)
    console.log(customer);
  };

  const handleSizeChange = (productId, size, checked) => {
        console.log(productId, size, checked);
        
    setSelectedSizes((prevSelectedSizes) => ({
      ...prevSelectedSizes,
      [productId]: {
        ...prevSelectedSizes[productId],
        [size]: checked,
      },
    }));
  };

  const renderSizesWithCheckboxes = (sizes, productId) =>
    sizes.map(({ size, quantity }) => (
      <div key={size}>
        <Checkbox
          checked={selectedSizes[productId]?.[size] || false}
          onChange={(e) => handleSizeChange(productId, size, e.target.checked)}
        >
          {size}: {quantity}
        </Checkbox>
      </div>
    ));

  const columns = [
    {
      title: 'Product Name',
      dataIndex: ['productId', 'name'],
      key: 'productId.name',
    },
    {
      title: 'Sizes & Quantities',
      dataIndex: 'orderSizes',
      key: 'orderSizes',
      render: (sizes, record) => renderSizesWithCheckboxes(sizes, record.productId._id),
    },
  ];

  return (
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
      <div className='flex justify-between p-2'>
        <p>Label: {customer.label}</p>
        <div className='flex justify-end gap-2'>
          <Button className='bg-blue-600 text-white'>
            Print <IoPrintSharp />
          </Button>
          <Button className='bg-green-500 text-white' onClick={() => handleOrderDone(customer._id)}>
            Done <GoFileSubmodule />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default CustomerCard;
