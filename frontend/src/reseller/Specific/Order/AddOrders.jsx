import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Typography, List, Divider, Empty } from 'antd';
import SearchBar from './SearchBar';
import SizeList from './SizeList';
import { updateOrder } from '../../Redux/ordersSlice'; // Ensure you use this if needed

const { Title, Text } = Typography;

const AddOrders = ({ customerId }) => {
  const dispatch = useDispatch(); // Use this if you plan to dispatch actions

  // Find the customer with the matching ID in the state
  const customer = useSelector(state =>
    state.orders.customer.find(customer => customer._id === customerId)
  );

  useEffect(() => {
    console.log(customer);
    
    // Example: Dispatch an action or perform some side effect when `customer` changes
    if (customer) {
      console.log('Customer data has changed:', customer);
      // Example: dispatch(updateOrder(customer)) if needed
    }
  }, [customer]); // Dependency array ensures the effect runs when `customer` changes

  const onChangeSizes = (sizes) => {
    console.log('Sizes changed:', sizes);
    // Add functionality as needed
  };

  return (
    <div style={{ padding: '0px', margin: '0 auto' }}>
      <Card>
        <Title level={5}>Customer Created Successfully!</Title>

        {customer ? (
          <>
            <SearchBar customerId={customerId} />

            <Divider />

            {customer.orders?.length > 0 ? (
              <List
                className='overflow-y-scroll'
                itemLayout="horizontal"
                dataSource={customer.orders}
                renderItem={order => (
                  <List.Item>
                    <List.Item.Meta
                      title={<Text strong>Order ID: {order._id}</Text>}
                      description={
                        <div>
                          <Text>Name: {order.name}</Text><br />
                          {order.orderSizes && Object.entries(order.orderSizes).map(([key, value]) => (

                            <Text key={key}>{key}: {value}</Text>
                          ))}
                          {/* <Text>Order Total: {order.orderTotal}</Text> */}
                          <SizeList sizes={order.sizes} productId={order._id} customerId={customerId} />
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty description="No orders found" />
            )}
          </>
        ) : (
          <Empty description="Customer not found" />
        )}
      </Card>
    </div>
  );
};

export default AddOrders;
