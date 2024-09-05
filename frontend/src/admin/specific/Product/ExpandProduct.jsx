import { Switch, message } from 'antd';
import React from 'react';
import { onSizeSwitchChange, onStockSwitchChange } from '../../Api/postApi';

const ExpandProduct = ({ record, onProductUpdate }) => {

  // Toggle full stock availability
  const handleStockSwitchChange = (checked) => {
    message.success(`Stock ${checked ? 'available' : 'unavailable'}`);
    const updatedSizes = Object.keys(record.sizes).reduce((acc, size) => {
      acc[size] = checked;
      return acc;
    }, {});
  
    const updatedRecord = {
      ...record,
      stock: checked,
      sizes: updatedSizes,
    };
    onStockSwitchChange({ fullstockout: checked, sizes: {}, productID: record._id });
    onProductUpdate(updatedRecord); // Update product in parent
  };
  

  // Toggle individual size availability
  const handleSizeSwitchChange = (size, checked) => {
    message.success(`Size ${size} is now ${checked ? 'in stock' : 'out of stock'}`);
    const updatedSizes = { ...record.sizes, [size]: checked };
    
    // Check if any size is in stock
    const stockDetail = Object.values(updatedSizes).some((item) => item === true);

    const updatedRecord = {
      ...record,
      sizes: updatedSizes,
      stock: stockDetail, // Set overall stock status based on individual sizes
    };
    
    onSizeSwitchChange({
      fullstockout: true, 
      sizes: { [size]: checked },
      productID: record._id,
    });
    onProductUpdate(updatedRecord); // Update product in parent
  };

  return (
    <div className="p-4 bg-gray-100 rounded-md">
      <div>
        <div className="flex justify-between">
          <h3 className="text-lg font-semibold mb-2">Sizes Available:</h3>
          <div className="flex gap-2">
            <p>{record.stock ? 'Stock Out Full' : 'Stock In Full'}</p>
            <Switch checked={record.stock} onChange={handleStockSwitchChange} />
          </div>
        </div>

        {/* Render the sizes */}
        {Object.entries(record.sizes).map(([size, available], index) => (
          <div key={index} className="p-2 flex justify-between items-center bg-white border rounded-md mb-1 shadow-sm">
            <span>{size}</span>
            <span>{available ? 'In Stock' : 'Out of Stock'}</span>
            <Switch
              checked={available}
              onChange={(checked) => handleSizeSwitchChange(size, checked)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExpandProduct;
