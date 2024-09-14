import React, { useEffect, useState } from 'react';
import { Form, Input, Button, Spin, message, Select } from 'antd';
import { fetchBadge } from '../../Api/getApi';
import ListBadges from './ListBadges';
import { useDispatch } from 'react-redux';
import { addCustomization } from '../../Redux/ordersSlice';
const CustomizeOrder = ({ selectedOrder,customerId }) => {

  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedBadges, setSelectedBadges] = useState([]);
  const dispatch = useDispatch()

  useEffect(() => {
    const loadBadges = async () => {
      try {
        const response = await fetchBadge();
        setBadges(response.badge);
      } catch (error) {
        console.error('Error fetching badges:', error);
        message.error('Failed to load badges');
      } finally {
        setLoading(false);
      }
    };

    loadBadges();
  }, []);

  const handleBadgeSelect = (badge) => {
    setSelectedBadges((prevSelected) => {
      const exists = prevSelected.some((b) => b._id === badge._id);

      if (exists) {
        return prevSelected.filter((b) => b._id !== badge._id);
      } else if (prevSelected.length < 3) {
        return [...prevSelected, badge];
      } else {
        message.warning('You can only select up to 3 badges!');
        return prevSelected;
      }
    });
  };

  const handleBadgeRemove = (badgeId) => {
    setSelectedBadges((prevSelected) =>
      prevSelected.filter((b) => b._id !== badgeId)
    );
  };

  const handleSizeSelect = (value) => {
    setSelectedSize(value);
  };

  const onFinish = (customization) => {
    console.log(customization);
    
    if (!selectedSize) {
      message.error('Please select a size!');
      return;
    }
    dispatch(addCustomization({
      customerId: customerId,
      productId: selectedOrder._id,
      customization: customization
    }));
        // Handle form submission
  };

  return (
    <>
  {selectedOrder ? (
  <div className="p-4 rounded-lg max-w-2xl mx-auto bg-white shadow-md">
    {loading ? (
      <Spin size="large" />
    ) : (
      <div className="flex flex-col items-center space-y-2">
        <Form layout="vertical" onFinish={onFinish} className="w-full">
  <div className="flex flex-col md:flex-row md:space-x-6 md:space-y-4 md:space-y-0">
    <Form.Item
      name="name"
      label="Your Name"
      className="w-full md:w-1/2"
      rules={[{ required: true, message: 'Please input your name!' }]}
    >
      <Input placeholder="Enter your name" />
    </Form.Item>

    <Form.Item
      name="number"
      label="Phone Number"
      className="w-full md:w-1/2"
      rules={[
        { required: true, message: 'Please input your number!' },
        { pattern: /^[0-9]+$/, message: 'Number must be digits!' },
      ]}
    >
      <Input placeholder="Enter your number" />
    </Form.Item>
  </div>

  <div className="flex flex-col md:flex-row md:space-x-6 md:space-y-4 md:space-y-0">
    <Form.Item
      name="size"
      label="Size"
      className="w-full md:w-1/2"
      rules={[{ required: true, message: 'Please select a size!' }]}
    >
     <Select
  placeholder="Select size"
  onChange={handleSizeSelect}
  value={selectedSize}
>
  {selectedOrder && selectedOrder.orderSizes ? (
    Object.keys(selectedOrder.orderSizes).map((size) => (
      <Select.Option key={size} value={size}>
        {size}
      </Select.Option>
    ))
  ) : (
    <Select.Option disabled>No sizes available</Select.Option>
  )}
</Select>

    </Form.Item>

    <Form.Item
      name="productType"
      label="Product Type"
      className="w-full md:w-1/2"
      rules={[{ required: true, message: 'Please select a product type!' }]}
    >
      <Select placeholder="Select product type">
        <Select.Option value="Vinyl">Vinyl</Select.Option>
        <Select.Option value="DTF">DTF</Select.Option>
        <Select.Option value="ORIGINAL(RETROS)">ORIGINAL(RETROS)</Select.Option>
      </Select>
    </Form.Item>
  </div>

  <Form.Item className="w-full mt-4">
    <Button
      type="primary"
      htmlType="submit"
      className="w-full"
    >
      Add To Order
    </Button>
  </Form.Item>
</Form>


        <ListBadges
        selectedOrder={selectedOrder}
          badges={badges}
          customerId={customerId}
          selectedBadges={selectedBadges}
          onBadgeSelect={handleBadgeSelect}
        />

        {selectedBadges.length > 0 && (
          <div className="mt-1 w-full">
            <h4 className="text-lg font-semibold mb-1">Selected Badges:</h4>
            <div className="flex flex-wrap gap-6">
              {selectedBadges.map((badge) => (
                <div
                  key={badge._id}
                  className="flex items-center border rounded-lg p-4 w-full sm:w-auto shadow-sm"
                >
                  <img
                    alt={badge.name}
                    src={badge.image?.url || 'https://via.placeholder.com/150'}
                    className="object-cover h-12 w-12 mr-4"
                  />
                  <div>
                    <div className="font-semibold">{badge.name}</div>
                    <div className="text-gray-600">Price: ${badge.price}</div>
                  </div>
                  <Button
                    type="danger"
                    className="ml-auto"
                    onClick={() => handleBadgeRemove(badge._id)}
                  >
                    Remove
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

       
      </div>
    )}
  </div>
) : null}


    </>
  );
};

export default CustomizeOrder;
