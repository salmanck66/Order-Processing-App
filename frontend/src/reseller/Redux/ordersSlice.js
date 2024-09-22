import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from 'uuid';
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
      console.log(action.payload);

      const customers = [...state.customer];

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

        if (customer.orders) {
          customer.orders.push(action.payload.product);
        } else {
          customer.orders = [action.payload.product];
        }

        // Since Redux Toolkit uses immer.js under the hood, state mutations are allowed
        const customerIndex = state.customer.findIndex(
          (item) => item._id === action.payload.customerId
        );
        if (customerIndex !== -1) {
          state.customer[customerIndex] = customer;
        }
        state.totalPrice = isNaN(state.totalPrice) ? 0 : state.totalPrice;
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

      // Find the customer to be deleted
      const customerToDelete = state.customer.find(
        (item) => item._id === action.payload
      );
      console.log(JSON.stringify(customerToDelete));

      if (customerToDelete && customerToDelete.orders) {
        // Calculate the sum and count of orders
        const sum = customerToDelete.orders.reduce(
          (acc, order) => acc + order.total,
          0
        );
        const count = customerToDelete.orders.length;

        // Update the totals
        state.totalPrice = state.totalPrice - sum;

        // Remove the customer from the state
        state.totalProducts = state.totalProducts - count;
        state.customer = state.customer.filter(
          (item) => item._id !== action.payload
        );
      } else {
        state.customer = state.customer.filter(
          (item) => item._id !== action.payload
        );
        // Handle case where the customer is not found or has no orders
        console.error(
          `Customer with ID ${action.payload} not found or has no orders.`
        );
      }

      // Update the total number of customers
      state.totalCustomers = state.totalCustomers - 1;
    },

    submitCustomers: (state) => {
      state.customer = [];
      state.totalCustomers = 0;
      state.totalProducts = 0;
      state.totalPrice = 0;
    },
    addCustomization: (state, action) => {
      const { customerId, productId, customization } = action.payload;
    
      // Price ranges for customizations
      const customizationPrices = {
        Vinyl: 150,
        DTF: 200,
        RETROS: 300,
      };
    
      // Find the index of the customer with the matching customerId
      const customerIndex = state.customer.findIndex(
        (customer) => customer._id === customerId
      );
    
      if (customerIndex === -1) {
        // Customer not found
        console.warn("No customer found with the provided customerId");
        return state; // Return the unchanged state
      }
    
      // Extract the found customer
      const customer = state.customer[customerIndex];
    
      // Find the index of the order within the customer's orders
      const orderIndex = customer.orders.findIndex(
        (order) => order._id === productId
      );
    
      if (orderIndex === -1) {
        // Order not found
        console.warn("No order found with the provided productId");
        return state; // Return the unchanged state
      }
    
      // Add the customization to the order's customizations array
      if (!customer.orders[orderIndex].customizations) {
        customer.orders[orderIndex].customizations = []; // Initialize if empty
      }
      customer.orders[orderIndex].customizations.push(customization);
      console.log(customization);
      const { productType } = customization;

      // Check if the customization has a price and increase the total accordingly
      const customizationPrice = customizationPrices[productType];
      
      if (customizationPrice) {
        customer.orders[orderIndex].total += customizationPrice;
        state.totalPrice = state.totalPrice+= customizationPrice
      } else {
        console.warn("No price found for the customization:", customization);
      }
    
      // Update the customer in the state
      state.customer[customerIndex] = customer;
    
      console.log(
        `Added customization to order ${productId} for customer ${customerId}:`,
        JSON.stringify(state.customer, null, 2)
      );
    },
    
    addBadges: (state, action) => {
      const { customerId, productId, badges, totalPrice } = action.payload;
    
      // Find the index of the customer with the matching customerId
      const customerIndex = state.customer.findIndex(
        (customer) => customer._id === customerId
      );
    
      if (customerIndex === -1) {
        console.warn("No customer found with the provided customerId");
        return state;
      }
    
      // Extract the found customer
      const customer = state.customer[customerIndex];
    
      // Find the index of the order within the customer's orders
      const orderIndex = customer.orders.findIndex(
        (order) => order._id === productId
      );
    
      if (orderIndex === -1) {
        console.warn("No order found with the provided productId");
        return state;
      }
    
      const order = customer.orders[orderIndex];
    
      // Initialize badges if undefined
      if (!order.badges) {
        order.badges = [];
      }
    
      // Add new badges for the order
      badges.forEach(({ size, badges: newBadges }) => {
        order.badges.push({ size, id: uuidv4(), badges: [...newBadges] });
      });
    
      // Ensure order.totalPrice is initialized before adding the badge totalPrice
      order.total = (order.total || 0) + totalPrice;
      
      // Update the global state totalPrice
      state.totalPrice = (state.totalPrice || 0) + totalPrice;
    
      // Update customer in state
      state.customer[customerIndex] = customer;
    
      console.log(
        `Added badges to order ${productId} for customer ${customerId}:`,
        JSON.stringify(badges, null, 2)
      );
      console.log(`Total Price for order ${productId}: ${order.total}`);
      console.log(`Global Total Price: ${state.totalPrice}`);
    },
    
    
    deleteBadge: (state, action) => {
      const { customerId, productId, badgeId, badgePrice } = action.payload; // Expect the price of the badge being deleted
    
      const customerIndex = state.customer.findIndex(
        (customer) => customer._id === customerId
      );
    
      if (customerIndex === -1) {
        console.warn("No customer found with the provided customerId");
        return state;
      }
    
      const customer = state.customer[customerIndex];
      const orderIndex = customer.orders.findIndex(
        (order) => order._id === productId
      );
    
      if (orderIndex === -1) {
        console.warn("No order found with the provided productId");
        return state;
      }
    
      const order = customer.orders[orderIndex];
    
      // Find the index of the badge to delete
      const badgeIndex = order.badges.findIndex(
        (badgeItem) => badgeItem.id === badgeId
      );
    
      if (badgeIndex !== -1) {
        // Reduce the price for the removed badge
        if (badgePrice) {
          order.total = (order.total || 0) - badgePrice;
          state.totalPrice = (state.totalPrice || 0) - badgePrice;
        }
    
        // Remove the badge from the badges array
        order.badges.splice(badgeIndex, 1);
        console.log(`Deleted badge ${badgeId} from order ${productId}`);
      } else {
        console.warn("No badge found with the provided badgeId");
      }
    
      state.customer[customerIndex] = customer;
    
      console.log(`Updated total for order ${productId}: ${order.total}`);
      console.log(`Global Total Price after deletion: ${state.totalPrice}`);
    },
    
 
    deleteCustomization: (state, action) => {
      const { customerId, productId, customizationId } = action.payload;
    
      // Price ranges for customizations
      const customizationPrices = {
        Vinyl: 150,
        DTF: 200,
        RETROS: 300,
      };
    
      // Find customer
      const customerIndex = state.customer.findIndex(
        (customer) => customer._id === customerId
      );
      if (customerIndex === -1) {
        console.warn("No customer found with the provided customerId");
        return state;
      }
    
      const customer = state.customer[customerIndex];
    
      // Find order
      const orderIndex = customer.orders.findIndex(
        (order) => order._id === productId
      );
      if (orderIndex === -1) {
        console.warn("No order found with the provided productId");
        return state;
      }
    
      // Find the customization to be deleted
      const customizationIndex = customer.orders[orderIndex].customizations.findIndex(
        (custom) => custom.id === customizationId
      );
    
      if (customizationIndex === -1) {
        console.warn("No customization found with the provided customizationId");
        return state;
      }
    
      // Get the productType of the customization before deletion
      const customization = customer.orders[orderIndex].customizations[customizationIndex];
      const { productType } = customization;
    
      // Check if the customization has a price and decrease the total accordingly
      const customizationPrice = customizationPrices[productType];
      if (customizationPrice) {
        customer.orders[orderIndex].total -= customizationPrice;
        state.totalPrice -= customizationPrice; // Adjust the overall total price
      } else {
        console.warn("No price found for the customization:", productType);
      }
    
      // Filter out the customization
      customer.orders[orderIndex].customizations = customer.orders[
        orderIndex
      ].customizations.filter((custom) => custom.id !== customizationId);
    
      // Update state
      state.customer[customerIndex] = customer;
    
      console.log(
        `Deleted customization ${customizationId} from order ${productId} for customer ${customerId}:`,
        JSON.stringify(state.customer, null, 2)
      );
    },
    
  },
});

export const {
  addCustomer,
  deleteCustomer,
  addOrder,
  deleteOrder,
  updateOrder,
  clearOrders,
  addCustomization,
  submitCustomers,
  addBadges,
  deleteBadge,
  deleteCustomization,
} = ordersSlice.actions;
export default ordersSlice.reducer;
