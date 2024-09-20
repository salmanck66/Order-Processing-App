import React from 'react';
import { MdDeleteOutline } from 'react-icons/md';
import { useDispatch } from 'react-redux';
import { deleteCustomization } from '../../Redux/ordersSlice';
import { Popconfirm, Card, Typography, Row, Col, message } from 'antd';

const { Title, Paragraph } = Typography;

const OrderDetails = ({ order, badges, customerId }) => {
  const dispatch = useDispatch();

  const handleDeleteCustomization = (customizationId) => {
    dispatch(deleteCustomization({ customerId, productId: order._id, customizationId }));
    message.success('Customization deleted successfully');
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md" style={{ maxWidth: '800px', margin: '0 auto' }}>
      {/* Customization Details */}
      <Title level={2} className="mb-4 text-gray-800">Customization Details</Title>
      {order.customizations && order.customizations.length > 0 ? (
        <Row gutter={16}>
          {order.customizations.map((custom) => (
            <Col key={custom.id} xs={24} sm={12} md={8} lg={6}>
              <Card
                title={custom.name}
                extra={
                  <Popconfirm
                    title="Are you sure to delete this customization?"
                    onConfirm={() => handleDeleteCustomization(custom.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <span className="cursor-pointer text-red-500">
                      <MdDeleteOutline />
                    </span>
                  </Popconfirm>
                }
                className="customization-card"
              >
                <Paragraph><strong>Id:</strong> {custom.id}</Paragraph>
                <Paragraph><strong>Number:</strong> {custom.number}</Paragraph>
                <Paragraph><strong>Size:</strong> {custom.size}</Paragraph>
                <Paragraph><strong>Product Type:</strong> {custom.productType}</Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <Paragraph className="text-gray-500">No customization details available.</Paragraph>
      )}

      {/* Badge Details */}
      <Title level={2} className="mb-4 mt-8 text-gray-800">Badge Details</Title>
      {order.badges && order.badges.length > 0 ? (
        order.badges.map((badgeItem, index) => (
          <div key={index} className="mb-6">
            <Title level={3} className="mb-2"><strong>Size:</strong> {badgeItem.size}</Title>
            {badgeItem.badges && badgeItem.badges.length > 0 ? (
              <Row gutter={16}>
                {badgeItem.badges.map((badgeId) => {
                  const badge = badges.find(b => b._id === badgeId);
                  return badge ? (
                    <Col key={badge._id} xs={24} sm={12} md={8} lg={8}>
                      <Card className="badge-card">
                        <img 
                          src={badge.image.url} 
                          alt={badge.name} 
                          className="w-10 h-auto mb-2 rounded"
                        />
                        <Paragraph><strong>Name:</strong> {badge.name}</Paragraph>
                        <Paragraph><strong>Price:</strong> ${badge.price}</Paragraph>
                      </Card>
                    </Col>
                  ) : (
                    <Paragraph key={badgeId} className="text-gray-500">Badge not found</Paragraph>
                  );
                })}
              </Row>
            ) : (
              <Paragraph className="text-gray-500">No badges for this size.</Paragraph>
            )}
          </div>
        ))
      ) : (
        <Paragraph className="text-gray-500">No badges available.</Paragraph>
      )}
    </div>
  );
};

export default OrderDetails;
