import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  // orders: [],
  customer: [],
  totalPrice: 0,
  totalCustomers: 0,
  totalProducts: 0,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    addCustomer: (state, action) => {
      state.customer.push(action.payload);
      state.totalCustomers = state.totalCustomers + 1;
    },
    addOrder: (state, action) => {

      
      // console.log('Dispatching addOrder');
      // console.log('Action Payload:', JSON.stringify(action.payload, null, 2));

      // Accessing the customer array
      const customers = [...state.customer]; // Converting Proxy to plain array
      // console.log('Current Customers:', JSON.stringify(customers, null, 2));

      // Filtering based on customerId
      const result = customers.filter(
        (item) => item._id === action.payload.customerId
      );
      // console.log('Filtered Result:', JSON.stringify(result, null, 2));

      if (result.length === 0) {
        console.log("No customer found with the provided customerId");
      } else {
        state.totalProducts = state.totalProducts + 1;
        const customer = result[0];
        // console.log('Customer found:', customer);

        // Check if the customer already has an 'orders' array
        if (customer.orders) {
          
          customer.orders.push(action.payload.product);
        } else {
          // console.log('No orders found, creating a new orders array');
          // Create an orders array and add the product
          customer.orders = [action.payload.product];
        }

        // Since Redux Toolkit uses immer.js under the hood, state mutations are allowed
        const customerIndex = state.customer.findIndex(
          (item) => item._id === action.payload.customerId
        );
        if (customerIndex !== -1) {
          state.customer[customerIndex] = customer;
        }

        // console.log('Updated Customer Orders:', JSON.stringify(state.customer[customerIndex].orders, null, 2));
      }
    },

    deleteOrder: (state, action) => {
      const customers = [...state.customer];

      // Find the index of the customer with the matching ID
      const customerIndex = customers.findIndex(
        (customer) => customer._id === action.payload.customerId
      );

      if (customerIndex === -1) {
        // Customer not found
        console.warn("No customer found with the provided customerId");
        return state; // Return the unchanged state
      }

      const customer = customers[customerIndex];
      const sum = customer.orders.find(
        (order) => order._id === action.payload.orderId
      ).total;
      console.log(JSON.stringify(sum));
      state.totalPrice = state.totalPrice - sum;
      state.totalProducts = state.totalProducts - 1;
      customer.orders = customer.orders.filter(
        (order) => order._id !== action.payload.orderId
      );
    },
    updateOrder: (state, action) => {
      // Debugging: Log the incoming payload
      console.log("Incoming payload:", action.payload);

      // Create a copy of the current state
      const customers = [...state.customer];

      // Find the index of the customer with the matching ID
      const customerIndex = customers.findIndex(
        (customer) => customer._id === action.payload.customerId
      );

      if (customerIndex === -1) {
        // Customer not found
        console.warn("No customer found with the provided customerId");
        return state; // Return the unchanged state
      }

      // Extract the found customer
      const customer = customers[customerIndex];

      // Find the index of the order within the customer's orders
      const orderIndex = customer.orders.findIndex(
        (order) => order._id === action.payload.productId
      );

      if (orderIndex === -1) {
        // Order not found
        console.warn("No order found with the provided productId");
        return state; // Return the unchanged state
      }

      // Calculate the sum of the numericValues multiplied by the product price
      let sum = Object.keys(action.payload.numericValues).reduce(
        (total, key) => {
          return (
            total +
            action.payload.numericValues[key] *
              customer.orders[orderIndex].price
          );
        },
        0
      );
      console.log(JSON.stringify(sum));
      const prev = customer.orders[orderIndex]?.total || 0;

      // Update the order with the new orderSizes and calculated sum
      customer.orders[orderIndex] = {
        ...customer.orders[orderIndex],
        orderSizes: action.payload.numericValues,
        total: sum,
      };
      console.log(prev, sum, state.totalPrice);

      state.totalPrice = state.totalPrice + sum - prev;
      console.log(prev, sum, state.totalPrice);

      // Update the customer in the state
      // customers[customerIndex] = customer;

      console.log(
        "Updated Orders:",
        JSON.stringify(
          state.customer[customerIndex].orders[orderIndex],
          null,
          2
        )
      );
    },

    deleteCustomer: (state, action) => {
      console.log(action.payload);
      const sum = state.customer
        .find((item) => item._id === action.payload)
        .orders?.reduce((acc, order) => acc + order.total, 0);
      const count = state.customer.find((item) => item._id === action.payload)
        .orders.length;
      state.totalPrice = state.totalPrice - sum;
      state.totalProducts = state.totalProducts - count;
      state.customer = state.customer.filter(
        (item) => item._id !== action.payload
      );
      state.totalCustomers = state.totalCustomers - 1;
    },
    submitCustomers :(state) => {
      state.customer = []
      state.totalCustomers = 0
      state.totalProducts = 0
      state.totalPrice = 0
    }
  },
});

export const {
  addCustomer,
  deleteCustomer,
  addOrder,
  deleteOrder,
  updateOrder,
  clearOrders,
  submitCustomers,
} = ordersSlice.actions;
export default ordersSlice.reducer;
