import { Switch, message } from 'antd';
import React from 'react';

const ExpandProduct = ({ record, onStockSwitchChange, onSizeSwitchChange }) => {

  const handleStockSwitchChange = (checked) => {
    message.success(`Stock ${checked ? 'available' : 'unavailable'}`);
    onStockSwitchChange(checked);
  };

  const handleSizeSwitchChange = (size, checked) => {
    message.success(`Size ${size} is now ${checked ? 'in stock' : 'out of stock'}`);
    onSizeSwitchChange(size, checked);
  };

  return (
    <div className="p-4 bg-gray-100 rounded-md">
      <div>
        <div className='flex justify-between'>
          <h3 className="text-lg font-semibold mb-2">Sizes Available:</h3>
          {record.stock ? (
            <div className='flex gap-2'>
              <p>Stock Out Full</p>
              <Switch defaultChecked onChange={handleStockSwitchChange} />
            </div>
          ) : (
            <div className='flex gap-2'>
              <p>Stock In Full</p>
              <Switch onChange={handleStockSwitchChange} />
            </div>
          )}
        </div>
        {
          Object.entries(record.sizes).map(([size, available], index) => (
            <div key={index} className="p-2 flex justify-between items-center bg-white border rounded-md mb-1 shadow-sm">
              <span>{size}</span>
              <span>{available ? 'In Stock' : 'Out of Stock'}</span>
              <Switch
                defaultChecked={available}
                onChange={(checked) => handleSizeSwitchChange(size, checked)}
                loading={!available && record.stock === false} // Display loading when stock is out and record.stock is false
              />
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default ExpandProduct;
