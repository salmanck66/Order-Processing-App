import moment from "moment";
import Order from "../models/order.js";
import Reseller from "../models/reseller.js";

export const monthlyStatus = async () => {
    const previousMonths = [];

    for (let i = 0; i < 12; i++) {
        const monthYear = moment().subtract(i, 'months').format('MMMM YYYY');
        try {
            const monthData = await monthCounts(monthYear);
            previousMonths.push(monthData);
        } catch (error) {
            console.error(`Error fetching data for ${monthYear}:`, error);
            previousMonths.push({
                month: moment().subtract(i, 'months').format('MMM'),
                year: moment().subtract(i, 'months').format('YYYY'),
                orders: 0,
                resellers: 0
            });
        }
    }

    return previousMonths;
};

const monthCounts = async (data) => {
    const [monthName, year] = data.split(' ');
    const monthNumber = moment().month(monthName).format("M");

    try {
        const [ordersCount, resellersCount] = await Promise.all([
            Order.aggregate([
                { $project: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } } },
                { $match: { year: parseInt(year), month: parseInt(monthNumber) } },
                { $count: 'totalOrders' }
            ]),
            Reseller.aggregate([
                { $project: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } } },
                { $match: { year: parseInt(year), month: parseInt(monthNumber) } },
                { $count: 'totalResellers' }
            ])
        ]);

        const totalOrders = ordersCount.length > 0 ? ordersCount[0].totalOrders : 0;
        const totalResellers = resellersCount.length > 0 ? resellersCount[0].totalResellers : 0;

        return {
            month: monthName.substring(0, 3),
            year: parseInt(year),
            orders: totalOrders,
            resellers: totalResellers
        };
    } catch (error) {
        console.error(`Error counting data for ${data}:`, error);
        return {
            month: monthName.substring(0, 3),
            year: parseInt(year),
            orders: 0,
            resellers: 0
        };
    }
};
