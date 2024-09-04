import { Card,} from 'antd';
import CustomerCard from './CustomerCard';

const ManageOrders = ({ orders }) => {
  // Define columns for the orders table
 


  return (
    <div style={{ padding: '20px' }}>
      {orders && (
        <Card
          key={orders._id}
          title={`Reseller: ${orders.reseller.name}`}
          style={{ marginBottom: '20px' }}
        >
          {orders.customers.map((customer) => (
            <CustomerCard 
              key={customer._id} 
              customer={customer} 
            />
          ))}
        </Card>
      )}
    </div>
  );
};

export default ManageOrders;
