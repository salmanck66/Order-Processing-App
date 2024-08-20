import { Button, Dropdown, Space } from 'antd';
import { useState } from 'react';

// Define the dropdown menu items


// OrderStatusDropDown component
const OrderStatusDropDown = ({ initialStatus, onStatusChange, items }) => {
  const [status, setStatus] = useState(initialStatus);

  const handleMenuClick = (e) => {
    const selectedStatus = items.find(item => item.key === e.key)?.label;
    setStatus(selectedStatus);
    onStatusChange(selectedStatus);
  };

  return (
    <Space wrap>
      <Dropdown
        menu={{
          items,
          onClick: handleMenuClick,
        }}
        placement="bottomLeft"
        arrow
      >
        <Button>{status}</Button>
      </Dropdown>
    </Space>
  );
};

export default OrderStatusDropDown;