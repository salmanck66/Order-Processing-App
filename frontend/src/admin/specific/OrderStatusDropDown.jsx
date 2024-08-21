import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

const OrderStatusDropDown = ({ items, initialStatus, onStatusChange }) => {
  return (
    <Select
      defaultValue={initialStatus}
      onChange={(value) => onStatusChange(value)}
      style={{ width: 120 }}
    >
      {items.map((item) => (
        <Option key={item.key} value={item.label}>
          {item.label}
        </Option>
      ))}
    </Select>
  );
};

export default OrderStatusDropDown;
