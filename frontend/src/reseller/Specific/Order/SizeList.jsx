import React, { useState, useEffect } from 'react';
import { Popover, Button, Input } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { updateOrder } from '../../Redux/ordersSlice';

const SizeList = ({ sizes, productId, customerId, orderSizes = {} }) => {
    const dispatch = useDispatch();
    
    const [sizeValues, setSizeValues] = useState({});

    useEffect(() => {
        const initialSizeValues = Object.keys(sizes).reduce((acc, size) => ({
            ...acc,
            [size]: orderSizes?.[size] || '' // Safely access orderSizes with optional chaining
        }), {});
        
        setSizeValues(initialSizeValues);
    }, [sizes]);

    const handleInputChange = (size) => (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setSizeValues((prevSizeValues) => ({
                ...prevSizeValues,
                [size]: value
            }));
        }
    };

    const handleConfirm = () => {
        const numericValues = Object.entries(sizeValues).reduce((acc, [size, value]) => {
            const numValue = Number(value);
            if (numValue > 0) {
                return {
                    ...acc,
                    [size]: numValue
                };
            }
            return acc;
        }, {});

        dispatch(updateOrder({ customerId, numericValues, productId }));

        console.log(numericValues);
    };

    const availableSizes = Object.entries(sizes).filter(([size, available]) => available);

    const content = (
        <div className='w-fit'>
            {availableSizes.map(([size], index) => (
                <div key={index} style={{ marginBottom: '8px' }} className='grid grid-cols-5 w-fit'>
                    <span style={{ marginRight: '8px' }}>{size}</span>
                    <Input
                        className='w-fit col-span-4'
                        type="number"
                        placeholder="Value"
                        // value={sizeValues[size]} // Show the corresponding size value
                        onChange={handleInputChange(size)}
                    />
                </div>
            ))}
            <Button type="primary" onClick={handleConfirm} style={{ marginTop: '10px' }}>
                Update
            </Button>
        </div>
    );

    return (
        <Popover
            content={content}
            title="Select Size"
            trigger="click"
            overlayStyle={{ width: 250 }} // Adjust the width as needed
        >
            <Button className='md:block hidden'>
                view Size  <DownOutlined />
            </Button>
            <Button className='md:hidden '>
                Size  <DownOutlined />
            </Button>
        </Popover>
    );
};

export default SizeList;
