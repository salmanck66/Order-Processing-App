import React, { useState } from "react";
import { MdDeleteForever, MdDeleteOutline } from "react-icons/md";
import { useDispatch } from "react-redux";
import { deleteBadge, deleteCustomization } from "../../Redux/ordersSlice";
import { Popconfirm, Card, Typography, message, Button, Tooltip } from "antd";

const { Title, Paragraph } = Typography;

const OrderDetails = ({ order, badges, customerId }) => {
  const dispatch = useDispatch();
  const [showAllCustomizations, setShowAllCustomizations] = useState(false);

  const handleDeleteCustomization = (customizationId) => {
    dispatch(
      deleteCustomization({ customerId, productId: order._id, customizationId })
    );
    message.success("Customization deleted successfully");
  };
  // const handleDeleteBadge = (badgeId) => {
  //   dispatch(deleteBadge({ customerId, productId: order._id, badgeId }));
  //   message.success('Badge deleted successfully');

  // };
  const handleDeleteBadgeGroup = (badgeId, badgeIds) => {
    // Calculate the total price of the badges
    const badgePrice = badgeIds.reduce((total, badgeId) => {
      const badge = badges.find((b) => b._id === badgeId);
      return badge ? total + badge.price : total;
    }, 0);
    console.log(badgePrice);
    
    dispatch(
      deleteBadge({
        customerId,
        productId: order._id,
        badgeId,
        badgePrice, // Pass the calculated total price
      })
    );

    message.success(`Badges deleted successfully, total price: $${totalPrice}`);
  };

  const handleShowMoreToggle = () => {
    setShowAllCustomizations((prev) => !prev);
  };

  // Determine the customizations to display (show first 4 or all)
  const displayedCustomizations = showAllCustomizations
    ? order?.customizations
    : order?.customizations?.slice(0, 4);

  return (
    <div className="p-4 bg-white rounded-lg shadow-md gap-2">
      {/* Customization Details */}
      <div className="">
        {order.customizations && order.customizations?.length > 0 ? (
          <>
            <Title level={2} className="mb-4 text-gray-800">
              Customization Details
            </Title>
            <div className="grid grid-cols-4 gap-2">
              {displayedCustomizations.map((custom) => (
                <Card
                  key={custom._id}
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
                  className="customization-card gap-0"
                >
                  <p className="m-0 p-0">
                    <strong>Id:</strong> {custom.id}
                  </p>
                  <p className="m-0 p-0">
                    <strong>Number:</strong> {custom.number}
                  </p>
                  <p>
                    <strong>Size:</strong> {custom.size}
                  </p>
                  <p>
                    <strong>Product Type:</strong> {custom.productType}
                  </p>
                </Card>
              ))}
            </div>

            {order.customizations.length > 4 && (
              <Button type="link" onClick={handleShowMoreToggle}>
                {showAllCustomizations ? "Show Less" : "Show More"}
              </Button>
            )}
          </>
        ) : (
          <Paragraph className="text-gray-500">
            No customizations available.
          </Paragraph>
        )}
      </div>

      {/* Badge Details */}
      <div className="grid grid-cols-7 gap-2 justify-center mx-auto">
        {order.badges && order.badges.length > 0 ? (
          order.badges.map((badgeItem, index) => (
            <div key={index} className="shadow-xl  p-1 rounded-lg">
              <div className="flex justify-between p-1">
                <h2 className="mb-2 text-sm font-mono">
                  Size: {badgeItem.size}
                </h2>
                <Popconfirm
                  title="Are you sure to delete this badge?"
                  onConfirm={() => handleDeleteBadgeGroup(badgeItem.id, badgeItem.badges)}
                  okText="Yes"
                  cancelText="No"
                >
                  <MdDeleteForever
                    className='text-red-600 cursor-pointer text-md'
                  />
                </Popconfirm>
              </div>
              {badgeItem.badges && badgeItem.badges.length > 0 ? (
                <div className="flex justify-center">
                  {badgeItem.badges.map((badgeId) => {
                    const badge = badges.find((b) => b._id === badgeId);
                    return badge ? (
                      <Tooltip
                        key={badgeId}
                        title={`${badge.name} - $${badge.price}`} // Tooltip showing badge name and price
                      >
                        <img
                          src={badge.image.url}
                          alt={badge.name}
                          className="w-10 h-auto mb-2 me-2 rounded shadow-lg"
                        />
                      </Tooltip>
                    ) : (
                      <Paragraph key={badgeId} className="text-gray-500">
                        Badge not found
                      </Paragraph>
                    );
                  })}
                </div>
              ) : (
                <Paragraph className="text-gray-500">
                  No badges for this size.
                </Paragraph>
              )}
            </div>
          ))
        ) : (
          <Paragraph className="text-gray-500">No badges available.</Paragraph>
        )}
      </div>
    </div>
  );
};

export default OrderDetails;
