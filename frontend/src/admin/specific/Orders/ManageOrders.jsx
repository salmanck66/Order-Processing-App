import React, { useState, useEffect } from 'react';
import { Card, Button, message, Empty, Spin } from 'antd';
import CustomerCard from './CustomerCard';
import { CiCircleChevRight } from 'react-icons/ci';
import { submitReseller } from '../../Api/postApi';

const ManageOrders = ({ orders, orderTotalLength, currentOrder, onNextReseller }) => {
  const [loading, setLoading] = useState(false);
  const [allDone, setAllDone] = useState(false);

  // Check if all customers have their status set to true
  useEffect(() => {
    if (orders && orders.customers) {
      const allCompleted = orders.customers.every((cust) => cust.status === true);
      setAllDone(allCompleted);
    }
  }, [orders]);

  const handleChangeReseller = async () => {
    if (!orders) return; // Prevent action if orders is null or undefined

    setLoading(true);
    try {
      await submitReseller(orders._id);
      message.success('Reseller changed successfully!');
      onNextReseller(); // Call the callback function to refetch orders
    } catch (error) {
      message.error('Failed to change reseller.');
    } finally {
      setLoading(false);
    }
  };

  // Callback to handle customer order completion
  const handleCustomerOrderDone = (status) => {
    // Update completion status based on customer order completion
    // Assume status is a boolean indicating if all orders are done
    setAllDone(status);
  };

  return (
    <div style={{ padding: '0px' }}>
      {orders && orders.customers ? (
        <Card
          className="bg-[#0000002a]"
          key={orders._id}
          title={
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">
                {`Reseller: ${orders?.reseller?.name}`}
              </h2>
              <div className="flex items-center text-sm text-gray-500 bg-white p-2 rounded-lg border px-4">
                <span className="mr-1">{currentOrder || 1}</span>
                <span>/</span>
                <span className="ml-1">{orderTotalLength}</span>
              </div>
            </div>
          }
          style={{ marginBottom: '20px' }}
        >
          {orders.customers.map((customer) => (
            <CustomerCard
              orderId={orders._id}
              key={customer._id}
              customer={customer}
              onOrderDone={handleCustomerOrderDone}
            />
          ))}
          <div className="flex justify-end">
            <Button
              className="bg-green-500 text-white"
              disabled={!allDone || loading}
              onClick={handleChangeReseller}
            >
              {loading ? <Spin size="small" /> : 'Next Reseller'}
              <CiCircleChevRight className="text-xl" />
            </Button>
          </div>
        </Card>
      ) : (
        <Empty description="No orders available" />
      )}
    </div>
  );
};

export default ManageOrders;
