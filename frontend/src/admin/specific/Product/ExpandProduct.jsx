import { Switch } from 'antd';
import React from 'react';

const ExpandProduct = ({ record }) => {
  return (
    <div className="p-4 bg-gray-100 rounded-md">
      
      
      <div>
        <div className='flex justify-between'>
        <h3 className="text-lg font-semibold mb-2">Sizes Available:</h3>
        {record.stock ? <div className='flex  gap-2'><p>Stock Out Full </p><Switch defaultChecked /></div> :<div className='flex  gap-2'><p>Stock In Full </p><Switch  /></div>}
        </div>
        {
          Object.entries(record.sizes).map(([size, available], index) => (
            <div key={index} className="p-2 flex justify-between items-center bg-white border rounded-md mb-1 shadow-sm">
              <span>{size}</span>
              <span>{available ? 'In Stock' : 'Out of Stock'}</span>
              {available ? <Switch  defaultChecked /> : <Switch loading  />}
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default ExpandProduct;
