import { Button, Card, message, Empty } from "antd";
import CustomerCard from "./CustomerCard";
import { CiCircleChevRight } from "react-icons/ci";
import { submitReseller } from "../../Api/postApi";

const ManageOrders = ({ orders, orderTotalLength, currentOrder }) => {
  // Function to handle changing reseller
  const handleChangeReseller = async () => {
    try {
      await submitReseller(orders._id);
      // Display success message
      message.success("Reseller changed successfully!");
    } catch (error) {
      // Display error message
      message.error("Failed to change reseller.");
    }
  };

  return (
    <div style={{ padding: "0px" }}>
      {orders ? (
        <Card
          className="bg-[#0000002a] "
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
          style={{ marginBottom: "20px" }}
        >
          {orders.customers?.map((customer) => (
            <CustomerCard
              orderId={orders._id}
              key={customer._id}
              customer={customer}
            />
          ))}
          <div className="flex justify-end">
            <Button
              className="bg-green-500 text-white "
              disabled={orders.customers.every((cust) => cust.status === false)}
              onClick={handleChangeReseller}
            >
              Next Reseller <CiCircleChevRight className="text-xl" />
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
