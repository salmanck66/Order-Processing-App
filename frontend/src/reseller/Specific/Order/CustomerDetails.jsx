import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Table, Button, Popconfirm } from 'antd';
import SizeList from './SizeList';
import { FaRegTrashCan } from "react-icons/fa6"; // Import the trash icon
import { deleteOrder } from '../../Redux/ordersSlice';
import SearchBar from './SearchBar';
import { LuMoveLeft } from "react-icons/lu";

const CustomerDetails = () => {
    const { customerId } = useParams(); // Get customerId from URL parameters
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Use useNavigate hook

    // Find the customer in the Redux store
    const customer = useSelector(state =>
        state.orders.customer.find(customer => customer._id === customerId)
    );

    if (!customer) {
        return <div>Customer not found</div>;
    }

    // Function to handle deleting an order
    const handleDelete = useCallback((orderId) => {
        dispatch(deleteOrder({ customerId, orderId }));
    }, [dispatch, customerId]);

    // Function to handle navigating to the previous page
    const handleGoBack = () => {
        navigate(-1); // Go back to the previous page
    };

    // Columns configuration for the orders table
    const columns = [
        {
            title: 'Product Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
        },
        {
            title: 'Total',
            dataIndex: 'total',
            key: 'total',
        },
        {
            title: 'Order Sizes',
            dataIndex: 'orderSizes',
            key: 'orderSizes',
            render: (orderSizes) => (
                <>
                    {orderSizes && Object.keys(orderSizes).length > 0 ? (
                        Object.keys(orderSizes).map((size) => (
                            <div key={size}>
                                {size}: {orderSizes[size]}
                            </div>
                        ))
                    ) : (
                        <div>No sizes available</div>
                    )}
                </>
            ),
            responsive: ['md'],
        },
        {
            title: 'Sizes',
            dataIndex: 'sizes',
            key: 'sizes',
            render: (sizes, order) => (
                <SizeList
                    sizes={sizes}
                    customerId={customerId}
                    orderSizes={order.orderSizes}
                    productId={order._id}
                />
            ),
        },
        {
            title: 'Delete',
            key: 'delete',
            render: (_, order) => (
                <Popconfirm
                    title="Are you sure you want to delete this order?"
                    onConfirm={() => handleDelete(order._id)}
                    okText="Yes"
                    cancelText="No"
                >
                    <Button className='m-0 p-0 md:px-2' type='primary' danger>
                        <h1 className="hidden md:flex h-full items-center gap-2">
                            <FaRegTrashCan />
                            Delete
                        </h1>
                        <FaRegTrashCan className="md:hidden block" />
                    </Button>
                </Popconfirm>
            ),
        }
    ];

    return (
        <div className='p-1 md:p-10 flex flex-col gap-10'>
            <div className='flex h-full items-center'>
                <LuMoveLeft 
                    className='text-2xl hover:scale-105 cursor-pointer' 
                    onClick={handleGoBack} // Handle click event to go back
                />
                <SearchBar customerId={customerId}/>
            </div>
            <Table
                dataSource={customer.orders}
                columns={columns}
                rowKey="_id"
                pagination={false}
                scroll={{ x: '100%' }}
            />
        </div>
    );
};

export default CustomerDetails;
