import { Button, Card,} from 'antd';
import CustomerCard from './CustomerCard';
import { CiCircleChevRight } from "react-icons/ci";

const ManageOrders = ({ orders, orderTotalLength, currentOrder }) => {
  // Define columns for the orders table
 


  return (
    <div style={{ padding: '0px' }}>
      {orders && (
        <Card
        className='bg-[#0000002a] '
          key={orders._id}
          title={
            <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">
              {`Reseller: ${orders.reseller.name}`}
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
              key={customer._id} 
              customer={customer} 
            />
          ))}
    <div className='flex justify-end'>
        <Button   className='bg-green-500 text-white ' disabled>
          Next Reseller <CiCircleChevRight className='text-xl'/>
        </Button>
    </div>
        </Card>
      )}
    </div>
  );
};

export default ManageOrders;
