import React, { useState } from 'react';
import { Table, Card, Button, message, Checkbox, Tag } from 'antd';
import { IoPrintSharp } from "react-icons/io5";
import { GoFileSubmodule } from "react-icons/go";
import { ManageOutOffStock, statusChangeCustomer } from '../../Api/postApi';

const CustomerCard = ({ customer, orderId }) => {
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

  // Handle marking an order as done
  const handleOrderDone = async (customerId) => {
    try {
      await statusChangeCustomer(customerId,orderId );
      message.success('Order marked as done successfully!');
      console.log(`Order for customer ${customerId} marked as done.`);
    } catch (error) {
      message.error('Failed to mark order as done. Please try again.');
      console.error('Error marking order as done:', error);
    }
  };

  // Handle checkbox changes for sizes
  const handleSizeChange = async (productId, size, checked) => {
    try {
      await ManageOutOffStock({
        productId,
        size,
        checked,
        customerId: customer._id
      });
      setSelectedSizes((prevSelectedSizes) => ({
        ...prevSelectedSizes,
        [productId]: {
          ...prevSelectedSizes[productId],
          [size]: checked,
        },
      }));
      message.success('Stock status updated successfully!');
    } catch (error) {
      message.error('Failed to update stock status. Please try again.');
      console.error('Error updating stock status:', error);
    }
  };

  // Render sizes with checkboxes
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

  // Table columns
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
      title={
        <div className='flex  justify-between'>
          <h2>Customer: {customer.customerName}</h2>
          {
            customer.status ? (
              <Tag color="success">Completed</Tag>
            ):(
              <Tag color='cyan-inverse'>Pending</Tag>
            )
          }
        </div>
      }
      style={{ marginBottom: '20px' }}
    >
      {customer?.orders?.length > 0 ? (
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
        <p className='hidden sm:flex'>Label: {customer.label}</p>
        
        <div className='flex justify-end gap-2'>
          <Button className='bg-blue-600 text-white'>
            Print <IoPrintSharp />
          </Button>
          <Button
          disabled={customer.status}
            className='bg-green-500 text-white'
            onClick={() => handleOrderDone(customer._id)}
          >
            Done <GoFileSubmodule />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default CustomerCard;
