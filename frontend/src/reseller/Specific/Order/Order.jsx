import { Button, Input, Tag } from 'antd';
import React, { useState, useEffect } from 'react';
import { LuIndianRupee } from 'react-icons/lu';
import {  updateOrder } from '../../Redux/ordersSlice';
import { useDispatch } from 'react-redux';

const Order = ({ product, index }) => {
  const dispatch = useDispatch();
  const [quantities, setQuantities] = useState(
    Object.fromEntries(Object.entries(product.OrderSizes).map(([size, { available, quantity }]) => [size, { available, quantity }]))
  );
  const [totalOrderCount, setTotalOrderCount] = useState(0);

  const handleQuantityChange = (size, value) => {
    const quantity = parseInt(value, 10) || 0;
    const updatedQuantities = {
      ...quantities,
      [size]: { ...quantities[size], quantity },
    };

    setQuantities(updatedQuantities);
    dispatch(updateOrder({
      _id: product._id,
      sizes: updatedQuantities,
    }));
  };

  useEffect(() => {
    updateTotalOrderCount();
  }, [quantities]);

  const updateTotalOrderCount = () => {
    const totalCount = Object.values(quantities).reduce((sum, { quantity }) => sum + quantity, 0);
    setTotalOrderCount(totalCount);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-9 bg-white rounded-lg shadow-xl p-4 mb-4 items-start sm:items-center gap-4 sm:gap-0">
      <div className="sm:col-span-2 flex gap-3 items-start">
        <img
          src={product?.images[0]?.url}
          alt={product.name}
          className="w-24 h-24 sm:w-20 sm:h-20 rounded-lg object-cover"
        />
        <div className="flex flex-col justify-center sm:justify-start">
          <h1 className="text-sm font-extralight">No {index + 1}</h1>
          <div className="flex gap-2 items-center sm:items-start">
            <h1 className="text-lg font-medium">{product.name}</h1>
            <Tag className="flex w-fit items-center h-full" color="success">
              <LuIndianRupee className="mr-1" /> {product.price}
            </Tag>
          </div>
          <h1 className="text-md text-gray-500">{product.edition}</h1>
        </div>
      </div>
      <div className="sm:col-span-6 flex flex-wrap items-start gap-2 sm:p-3">
        {Object.entries(quantities).map(([size, { available, quantity }], i) => (
          available ? (
            <div key={i} className="flex items-center gap-2 mx-1">
              <Tag color="blue" className="text-sm font-light px-3 py-1">
                {size}
                <Input
                  type="number"
                  min="0"
                  value={quantity}
                  onChange={(e) => handleQuantityChange(size, e.target.value)}
                  className="w-16 ms-2"
                  placeholder="Qty"
                />
              </Tag>
            </div>
          ) : (
            <></>
          )
        ))}
      </div>
      <div className="sm:col-span-1 flex items-center justify-center sm:justify-end">
        <Button
          className="bg-red-500 hover:bg-red-700  ms-auto sm:w-fit text-white font-bold py-2 px-4"
        //   onClick={() => dispatch(removeOrder(product._id))}
        >
          Remove
        </Button>
      </div>
    </div>
  );
};

export default Order;
