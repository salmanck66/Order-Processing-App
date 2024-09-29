import React, { useState, useEffect } from "react";
import {
  Table,
  Card,
  Button,
  message,
  Checkbox,
  Tag,
  Spin,
  Modal,
  Descriptions,
} from "antd";
import { IoPrintSharp } from "react-icons/io5";
import { GoFileSubmodule } from "react-icons/go";
import { ManageOutOffStock, statusChangeCustomer } from "../../Api/postApi";
import { RiPoliceBadgeLine } from "react-icons/ri";
import { BiCustomize } from "react-icons/bi";

const CustomerCard = ({ customer, orderId, onOrderDone }) => {
  const [selectedSizes, setSelectedSizes] = useState(() => {
    const initialSizes = {};
    customer.orders.forEach((order) => {
      initialSizes[order.productId._id] = {};
      order.orderSizes.forEach(({ size }) => {
        initialSizes[order.productId._id][size] = true;
      });
    });
    return initialSizes;
  });

  const [loading, setLoading] = useState(false);
  const [orderDone, setOrderDone] = useState(customer.status);

  // States for Modal
  const [isCustomizationModalVisible, setIsCustomizationModalVisible] =
    useState(false);
  const [isBadgeModalVisible, setIsBadgeModalVisible] = useState(false);
  const [currentCustomization, setCurrentCustomization] = useState([]);
  const [currentBadges, setCurrentBadges] = useState([]);

  useEffect(() => {
    setOrderDone(customer.status);
  }, [customer.status]);

  const handleOrderDone = async (customerId) => {
    setLoading(true);
    try {
      const response = await statusChangeCustomer(customerId, orderId);
      console.log(response);

      setOrderDone(true); // Set orderDone to true only on success
      onOrderDone(response.status); // Notify parent component
      message.success("Order marked as done successfully!");
    } catch (error) {
      message.error("Failed to mark order as done. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSizeChange = async (productId, size, checked) => {
    setLoading(true);
    try {
      await ManageOutOffStock({
        productId,
        size,
        checked,
        customerId: customer._id,
      });
      setSelectedSizes((prevSelectedSizes) => ({
        ...prevSelectedSizes,
        [productId]: {
          ...prevSelectedSizes[productId],
          [size]: checked,
        },
      }));
      message.success("Stock status updated successfully!");
    } catch (error) {
      message.error("Failed to update stock status. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderSizesWithCheckboxes = (sizes, productId) =>
    sizes.map(({ size, quantity }) => (
      <div key={size}>
        <Checkbox
          checked={selectedSizes[productId]?.[size] || false}
          onChange={(e) => handleSizeChange(productId, size, e.target.checked)}
        >
          {size}: {quantity}
        </Checkbox>
      </div>
    ));

  // Handlers for Customization Modal
  const showCustomizationModal = (customizations) => {
    setCurrentCustomization(customizations);
    setIsCustomizationModalVisible(true);
  };

  const handleCustomizationModalOk = () => {
    setIsCustomizationModalVisible(false);
    setCurrentCustomization([]);
  };

  const handleCustomizationModalCancel = () => {
    setIsCustomizationModalVisible(false);
    setCurrentCustomization([]);
  };

  // Handlers for Badge Modal
  const showBadgeModal = (badges) => {
    setCurrentBadges(badges);
    setIsBadgeModalVisible(true);
  };

  const handleBadgeModalOk = () => {
    setIsBadgeModalVisible(false);
    setCurrentBadges([]);
  };

  const handleBadgeModalCancel = () => {
    setIsBadgeModalVisible(false);
    setCurrentBadges([]);
  };

  const columns = [
    {
      title: "Product Name",
      dataIndex: ["productId", "name"],
      key: "productId.name",
    },
    {
      title: "Sizes & Quantities",
      dataIndex: "orderSizes",
      key: "orderSizes",
      render: (sizes, record) =>
        renderSizesWithCheckboxes(sizes, record.productId._id),
    },
    {
      title: "Customization",
      dataIndex: "customizations",
      key: "customizations",
      render: (customizations) =>
        customizations && customizations.length > 0 ? (
          <Button type="primary" onClick={() => showCustomizationModal(customizations)}>
            <BiCustomize /> View Customizations
          </Button>
        ) : (
          <span className="flex   border rounded-md w-fit  p-1 items-center h-full gap-2">
            <BiCustomize />
            No Customizations
          </span>
        ),
    },
    {
      title: "Badges",
      dataIndex: "badges",
      key: "badges",
      render: (badges) =>
        badges && badges.length > 0 ? (
          <Button  type="primary"  onClick={() => showBadgeModal(badges)}>
            <RiPoliceBadgeLine className="text-xl" /> View Badges
          </Button>
        ) : (
          <span className="flex   border rounded-md w-fit  p-1 items-center h-full gap-2">
            <RiPoliceBadgeLine className="text-xl" />
            No Badges
          </span>
        ),
    },
  ];

  return (
    <Card
      key={customer._id}
      title={
        <div className="flex justify-between">
          <h2>Customer: {customer.customerName}</h2>
          {orderDone ? (
            <Tag color="success">Completed</Tag>
          ) : (
            <Tag color="warning">Pending ..</Tag>
          )}
        </div>
      }
      style={{ marginBottom: "20px" }}
    >
      {customer?.orders?.length > 0 ? (
        <Table
          dataSource={customer.orders}
          columns={columns}
          rowKey="_id"
          pagination={false}
        />
      ) : (
        <p>No orders available</p>
      )}
      <div className="flex justify-between p-2">
        <p className="hidden sm:flex">Label: {customer.label}</p>
        <div className="flex justify-end gap-2">
          <Button className="bg-blue-600 text-white">
            Print <IoPrintSharp />
          </Button>
          <Button
            disabled={orderDone || loading}
            className="bg-green-500 text-white"
            onClick={() => handleOrderDone(customer._id)}
          >
            {loading ? <Spin size="small" /> : "Done"} <GoFileSubmodule />
          </Button>
        </div>
      </div>

      {/* Customization Modal */}
      <Modal
        title="Customizations"
        visible={isCustomizationModalVisible}
        onOk={handleCustomizationModalOk}
        onCancel={handleCustomizationModalCancel}
        footer={[
          <Button key="ok" type="primary" onClick={handleCustomizationModalOk}>
            OK
          </Button>,
        ]}
      >
        {currentCustomization.length > 0 ? (
          <Descriptions
            bordered
            column={1}
            className="max-h-[300px]  overflow-y-auto no-scrollbar"
          >
            {currentCustomization.map((custom, index) => (
              <Descriptions.Item
                key={index}
                label={`Customization ${index + 1}`}
              >
                <p>
                  <strong>Name:</strong> {custom.name}
                </p>
                <p>
                  <strong>Number:</strong> {custom.number}
                </p>
                <p>
                  <strong>Size:</strong> {custom.size}
                </p>
                <p>
                  <strong>Type:</strong> {custom.productType}
                </p>
              </Descriptions.Item>
            ))}
          </Descriptions>
        ) : (
          <p>No customization details available.</p>
        )}
      </Modal>

      {/* Badge Modal */}
      <Modal
        title="Badges"
        visible={isBadgeModalVisible}
        onOk={handleBadgeModalOk}
        onCancel={handleBadgeModalCancel}
        footer={[
          <Button key="ok" type="primary" onClick={handleBadgeModalOk}>
            OK
          </Button>,
        ]}
      >
        {currentBadges.length > 0 ? (
          <Descriptions bordered column={1}>
            {currentBadges.map((badge, index) => (
              <Descriptions.Item key={index} label={`Badge ${index + 1}`}>
                <p>
                  <strong>Size:</strong> {badge.size}
                </p>
                <p>
                  <strong>Badges:</strong> {badge.badges.join(", ")}
                </p>
              </Descriptions.Item>
            ))}
          </Descriptions>
        ) : (
          <p>No badge details available.</p>
        )}
      </Modal>
    </Card>
  );
};

export default CustomerCard;
