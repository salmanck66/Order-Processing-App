import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { Table, Button, Popconfirm, Modal } from 'antd';
import SizeList from './SizeList';
import { FaRegTrashCan } from "react-icons/fa6";
import { deleteOrder } from '../../Redux/ordersSlice'; // Ensure fetchCustomer is imported
import SearchBar from './SearchBar';
import { LuMoveLeft } from "react-icons/lu";
import { MdOutlineDashboardCustomize } from "react-icons/md";
import CustomizeOrder from './CustomizeOrder';
import { fetchProducts } from '../../Api/PostApi';
fetchProducts
const CustomerDetails = () => {
    const { customerId } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [expandedRowKey, setExpandedRowKey] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);

    const customer = useSelector(state =>
        state.orders.customer.find(customer => customer._id === customerId)
    );

    useEffect(() => {
        
    }, [dispatch, customerId, customer]);

    if (!customer) {
        return <div>Customer not found</div>;
    }

    const handleDelete = useCallback((orderId) => {
        dispatch(deleteOrder({ customerId, orderId }));
    }, [dispatch, customerId]);

    const handleGoBack = () => {
        navigate(-1);
    };

    const toggleExpandRow = (orderId) => {
        setExpandedRowKey((prevOrderId) => (prevOrderId === orderId ? null : orderId));
    };

    const showModal = (order) => {
        setSelectedOrder(order);
        setIsModalVisible(true);
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setSelectedOrder(null);
    };

    const columns = [
        {
            title: 'Product Name',
            key: 'nameEdition',
            render: (order) => (
                <span>
                    {order.name}
                    <span>{order.edition && `- ${order.edition}`}</span>
                </span>
            ),
        },
        {
            title: 'Price',
            dataIndex: 'price',
            key: 'price',
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
                        <div>No sizes selected</div>
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
                <div onClick={(e) => e.stopPropagation()}> {/* Prevent row expansion on size selection */}
                    <SizeList
                        sizes={sizes}
                        customerId={customerId}
                        orderSizes={order.orderSizes}
                        productId={order._id}
                    />
                </div>
            ),
        },
        {
            title: 'Custom',
            key: 'Cust',
            render: (_, order) => (
                <Button
                    className='m-0 p-0 px-2 mx-auto flex'
                    type=''
                    onClick={(e) => {
                        e.stopPropagation(); // Prevent row expansion on button click
                        showModal(order); // Show customization modal
                    }}
                >
                    <h1 className="hidden md:flex h-full items-center gap-2">
                        <MdOutlineDashboardCustomize />
                        Customization
                    </h1>
                    <MdOutlineDashboardCustomize className="md:hidden block" />
                </Button>
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
                    <Button className='m-0 p-0 px-2 mx-auto flex' type='primary' danger>
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
                    onClick={handleGoBack}
                />
                <SearchBar customerId={customerId} />
            </div>
            <Table
                dataSource={customer.orders}
                columns={columns}
                rowKey="_id"
                pagination={false}
                scroll={{ x: '100%' }}
                expandable={{
                    expandedRowRender: (order) => (
                        <div>
                            <h2 className="text-2xl font-semibold mb-2">Customization Details</h2>
                            {order.customizations && order.customizations.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {order.customizations.map((custom, index) => (
                                        <div
                                            key={index}
                                            className="p-4 border border-gray-300 rounded-md shadow-md"
                                        >
                                            <p><strong>Name:</strong> {custom.name}</p>
                                            <p><strong>Number:</strong> {custom.number}</p>
                                            <p><strong>Size:</strong> {custom.size}</p>
                                            <p><strong>Product Type:</strong> {custom.productType}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p>No customization details available.</p>
                            )}
                        </div>
                    ),
                    rowExpandable: (order) => !!order,
                    expandedRowKeys: expandedRowKey ? [expandedRowKey] : [],
                    onExpand: (expanded, order) => {
                        toggleExpandRow(order._id);
                    }
                }}
                onRow={(order) => ({
                    onClick: () => toggleExpandRow(order._id),
                })}
            />
            <Modal
                title="Customize Order"
                visible={isModalVisible}
                onCancel={handleModalCancel}
                footer={null}
            >
                <CustomizeOrder 
                    handleModalCancel={handleModalCancel} 
                    selectedOrder={selectedOrder} 
                    customerId={customerId} 
                />
            </Modal>
        </div>
    );
};

export default CustomerDetails;
