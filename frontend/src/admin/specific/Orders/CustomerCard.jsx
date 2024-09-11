import React, { useState, useEffect } from 'react';
import { Table, Card, Button, message, Checkbox, Tag, Spin } from 'antd';
import { IoPrintSharp } from 'react-icons/io5';
import { GoFileSubmodule } from 'react-icons/go';
import { ManageOutOffStock, statusChangeCustomer } from '../../Api/postApi';

const CustomerCard = ({ customer, orderId, onOrderDone }) => {
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

  const [loading, setLoading] = useState(false);
  const [orderDone, setOrderDone] = useState(customer.status);

  useEffect(() => {
    setOrderDone(customer.status);
  }, [customer.status]);

  const handleOrderDone = async (customerId) => {
    setLoading(true);
    try {
      const response = await statusChangeCustomer(customerId, orderId);
      console.log(response);

      setOrderDone(true); // Set orderDone to true only on success
      onOrderDone(response.status); // Notify parent component
      message.success('Order marked as done successfully!');
    } catch (error) {
      message.error('Failed to mark order as done. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSizeChange = async (productId, size, checked) => {
    setLoading(true);
    try {
      await ManageOutOffStock({
        productId,
        size,
        checked,
        customerId: customer._id,
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
    } finally {
      setLoading(false);
    }
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
      render: (sizes, record) =>
        renderSizesWithCheckboxes(sizes, record.productId._id),
    },
  ];

  return (
    <Card
      key={customer._id}
      title={
        <div className='flex justify-between'>
          <h2>Customer: {customer.customerName}</h2>
          {orderDone ? (
            <Tag color='success'>Completed</Tag>
          ) : (
            <Tag color='cyan-inverse'>Pending</Tag>
          )}
        </div>
      }
      style={{ marginBottom: '20px' }}
    >
      {customer?.orders?.length > 0 ? (
        <Table
          dataSource={customer.orders}
          columns={columns}
          rowKey='_id'
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
            disabled={orderDone || loading}
            className='bg-green-500 text-white'
            onClick={() => handleOrderDone(customer._id)}
          >
            {loading ? <Spin size='small' /> : 'Done'} <GoFileSubmodule />
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default CustomerCard;
