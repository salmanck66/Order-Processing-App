import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, Typography, List, Divider, Empty } from 'antd';
import SearchBar from './SearchBar';
import SizeList from './SizeList';
import { updateOrder } from '../../Redux/ordersSlice'; // Ensure you use this if needed

const { Title, Text } = Typography;

const AddOrders = ({ customerId }) => {
  const dispatch = useDispatch();

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
  }, [customer]);

  const onChangeSizes = (sizes) => {
    console.log('Sizes changed:', sizes);
    // Add functionality as needed
  };

  return (
    <div className="container mx-auto p-4">
      <Card bordered={false} className="shadow-lg rounded-lg flex gap-0 flex-col items-center justify-center">
        <Title level={4} className=" text-sm text-blue-600">
          Customer Has Been Added , Please Select Products
        </Title>

        {customer ? (
          <>
            <SearchBar  customerId={customerId} />

            <Divider />

            {customer.orders?.length > 0 ? (
              <List
                className="overflow-y-scroll max-h-[60vh] " // Limiting height for scroll
                itemLayout="horizontal"
                dataSource={customer.orders}
                renderItem={order => (
                  <List.Item
                    className="border rounded-lg p-4 my-1 hover:shadow-md transition-shadow duration-300 ease-in-out"
                  >
                    <List.Item.Meta
                      title={<Text strong>Order ID: {order._id}</Text>}
                      description={
                        <div className="text-gray-600">
                          <Text>Name: {order.name}</Text>
                          <br />
                          {order.orderSizes &&
                            Object.entries(order.orderSizes).map(
                              ([key, value]) => (
                                <Text key={key}>
                                  {key}: {value} &nbsp;
                                </Text>
                              )
                            )}
                          <SizeList
                            sizes={order.sizes}
                            productId={order._id}
                            customerId={customerId}
                          />
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            ) : (
              <Empty
                description="No orders found"
                imageStyle={{ height: 60 }}
                className="py-8"
              />
            )}
          </>
        ) : (
          <Empty
            description="Customer not found"
            imageStyle={{ height: 60 }}
            className="py-8"
          />
        )}
      </Card>
    </div>
  );
};

export default AddOrders;
