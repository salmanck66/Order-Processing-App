import Order from '../models/order.js';
import Reseller from '../models/reseller.js';

export const status = async () => {
    try {
        // Count total resellers
        const totalResellers = await Reseller.countDocuments();

        // Count total orders
        const totalOrders = await Order.countDocuments();

        // Count total customers
        // Assuming each `customers` array in an order has unique customers, and we want to count distinct customers
        const distinctCustomers = await Order.aggregate([
            { $unwind: "$customers" },
            { $unwind: "$customers.orders" },
            { $group: { _id: "$customers.customerName" } },
            { $count: "totalCustomers" }
        ]);

        return {
            totalOrders,
            totalCustomers: distinctCustomers.length > 0 ? distinctCustomers[0].totalCustomers : 0,
            totalResellers
        };
    } catch (error) {
        console.error('Error fetching status:', error);
        return {
            totalOrders: 0,
            totalCustomers: 0,
            totalResellers: 0
        };
    }
};
