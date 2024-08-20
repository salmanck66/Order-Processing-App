import { Dropdown, Table, Space, Button } from 'antd';
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
  const [selectedItem, setSelectedItem] = useState(null);

  const handleMenuClick = (e) => {
    const selected = items.find(item => item.key === e.key)?.label;
    setSelectedItem(selected);
    // Perform any action based on the selected item
    console.log('Selected:', selected);
  };

  return (
    <div className='p-2 border rounded-lg h-[460px] col-span-2'>
      <div  className='flex  justify-between mx-10 p-2'>
      <h2>{data?.name || 'No Data Available'}</h2>
      <Dropdown
        menu={{
          items,
          onClick: handleMenuClick,
        }}
        placement="bottomLeft"
        arrow
      >
        <Button>{selectedItem || 'Select Status'}</Button>
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
