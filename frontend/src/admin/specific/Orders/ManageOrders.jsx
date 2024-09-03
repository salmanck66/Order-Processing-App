import React from 'react';
import { Card, message } from 'antd';
import CustomerCard from './CustomerCard';

const ManageOrders = ({ orders }) => {
  // Define columns for the orders table
 


  return (
    <div style={{ padding: '20px' }}>
      {orders.map((resellerOrder) => (
        <Card
          key={resellerOrder._id}
          title={`Reseller: ${resellerOrder.reseller.name}`}
          style={{ marginBottom: '20px' }}
        >
          {resellerOrder.customers.map((customer) => (
            <CustomerCard 
              key={customer._id} 
              customer={customer} 
            />
          ))}
        </Card>
      ))}
    </div>
  );
};

export default ManageOrders;
