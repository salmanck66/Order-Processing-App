import React from 'react';
import { Table, Pagination, Button, Popconfirm } from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaRegTrashCan } from 'react-icons/fa6';
import { deleteCustomer } from '../../Redux/ordersSlice';
import CustomerCheckout from './CustomerCheckout';
const CustomersList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { customer } = useSelector((state) => state.orders);

  const formattedData = customer.map((cust, index) => ({
    key: cust._id || index.toString(),
    customerName: cust.customerName,
    products: cust.orders?.length,
    total: cust.orders?.reduce((acc, order) => acc + order.total, 0)
  }));

  const [current, setCurrent] = React.useState(1);
  const pageSize = 10;

  const handleChange = (page) => {
    setCurrent(page);
  };

  const handleDelete = (customerId, e) => {
    e.stopPropagation(); // Prevent the row click from being triggered
    // Dispatch an action to delete the customer
    dispatch(deleteCustomer(customerId));
  };

  const paginationConfig = {
    current: current,
    pageSize: pageSize,
    total: formattedData.length,
    onChange: handleChange,
  };

  const columns = [
    {
      title: 'Customer Name',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Products Count',
      dataIndex: 'products',
      key: 'products',
    },
    {
        title: 'Total ',
        dataIndex: 'total',
        key: 'total',
      },
    

    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <Popconfirm
          title="Are you sure you want to delete this customer?"
          onConfirm={(e) => handleDelete(record.key, e)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary" className="flex items-center" danger onClick={(e) => e.stopPropagation()}>
            <FaRegTrashCan className="mr-2" />
            Delete
          </Button>
        </Popconfirm>
      ),
    },
  ];

  const handleRowClick = (record) => {
    navigate(`/reseller/customer-details/${record.key}`);
  };

  return (
    <div className='grid  grid-cols-11 gap-2'>
        <div className='col-span-8'>
      <Table
        columns={columns}
        dataSource={formattedData.slice((current - 1) * pageSize, current * pageSize)}
        pagination={false}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
      />
      <Pagination {...paginationConfig} style={{ marginTop: 16 }} />
    </div>
    <CustomerCheckout/>
    </div>
  );
};

export default CustomersList;
