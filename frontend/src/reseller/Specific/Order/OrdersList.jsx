import React, { useState } from "react";
import CreateCustomer from "./CreateCustomer";
import { Button } from "antd";
import { LuPlus } from "react-icons/lu";
import CustomersList from "./CustomersList";

const OrdersList = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const showCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateOk = (customer) => {
    setIsCreateModalOpen(false);
  };

  const handleCreateCancel = () => {
    setIsCreateModalOpen(false);
  };

  return (
    <>
      <div className="w-full flex ">
        <Button className="ms-auto w-fit" onClick={showCreateModal}>
          Upload Customer
          <LuPlus />
        </Button>

        <CreateCustomer
          title="Upload Customer"
          open={isCreateModalOpen}
          onOk={handleCreateOk}
          onCancel={handleCreateCancel}
        />
      </div>
      <CustomersList />
    </>
  );
};

export default OrdersList;
