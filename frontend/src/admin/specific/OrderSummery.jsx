import { Dropdown, Table, Menu, Button } from 'antd';
import OrderStatusDropDown from './OrderStatusDropDown';
import { useState } from 'react';

const items = [
  {
    key: '1',
    label: 'Received',
  },
  {
    key: '2',
    label: 'Processed',
  },
  {
    key: '3',
    label: 'Out of Stock',
  },
];

const columns = (onStatusChange) => [
  {
    title: 'Product Name',
    dataIndex: 'productName',
  },
  {
    title: 'Price',
    dataIndex: 'price',
  },
  {
    title: 'Size',
    dataIndex: 'size',
  },
  {
    title: 'Quantity',
    dataIndex: 'quantity',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    render: (text, record) => (
      <OrderStatusDropDown
        items={items}
        initialStatus={record.status}
        onStatusChange={(newStatus) => onStatusChange(record.id, newStatus)}
      />
    ),
  },
];

const OrderSummary = ({ data, onStatusChange }) => {
  const [selectedStatus, setSelectedStatus] = useState(null);

  const handleMenuClick = (e) => {
    const selectedLabel = items.find(item => item.key === e.key)?.label;
    if (selectedLabel) {
      setSelectedStatus(selectedLabel);
      handleStatusChangeAll(selectedLabel);
    }
  };

  const handleStatusChangeAll = (newStatus) => {
    data.orders.forEach((order) => {
      onStatusChange(order.id, newStatus);
    });
  };

  const menu = (
    <Menu onClick={handleMenuClick}>
      {items.map(item => (
        <Menu.Item key={item.key}>
          {item.label}
        </Menu.Item>
      ))}
    </Menu>
  );

  return (
    <div className='p-2 border rounded-lg h-[460px] col-span-2'>
      <div className='flex justify-between items-center mb-4 mx-10'>
        <h2>{data?.name || 'No Data Available'}</h2>
        <Dropdown overlay={menu}>
          <Button>{selectedStatus || 'Select Status for All'}</Button>
        </Dropdown>
      </div>
      {data?.orders ? (
        <Table
          columns={columns(onStatusChange)}
          dataSource={data.orders}
          rowKey="id"
        />
      ) : (
        <p>No Orders Available</p>
      )}
    </div>
  );
};

export default OrderSummary;
