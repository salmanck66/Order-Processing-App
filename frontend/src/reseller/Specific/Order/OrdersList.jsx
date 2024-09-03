import React, { useState } from "react";
import CreateCustomer from "./CreateCustomer";
import { Button } from "antd";
import { LuPlus } from "react-icons/lu";
import CustomersList from "./CustomersList";
import { useDispatch, useSelector } from "react-redux";
const OrdersList = () => {
  const dispatch = useDispatch();
  const { customer } = useSelector((state) => state.orders);

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
        <div className=" ms-auto py-5 w-full flex gap-2  justify-end  ">
        <Button className="" onClick={showCreateModal}>
          Upload Customer
          <LuPlus />
        </Button>
       
       
        </div>

        <CreateCustomer
          title="Upload Customer"
          open={isCreateModalOpen}
          onOk={handleCreateOk}
          onCancel={handleCreateCancel}
        />
      </div>
      <CustomersList customer={customer}    />
    </>
  );
};

export default OrdersList;
