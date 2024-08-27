import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
  totalPrice: 0,
  totalQuantity: 0,
};

const ordersSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    addOrder: (state, action) => {
      const initializedOrder = {
        ...action.payload,
        OrderSizes: Object.fromEntries(
          Object.entries(action.payload.sizes).map(([size, available]) => [
            size,
            { available: available ? 1 : 0, quantity: available ? 0 : 0 },
          ])
        ),
      };
      console.log('initializedOrder', initializedOrder);
      state.orders.push(initializedOrder);
      
      // Update totalQuantity and totalPrice
      const totalQuantity = state.orders.reduce((sum, order) => sum + Object.values(order.OrderSizes).reduce((sizeSum, { quantity }) => sizeSum + quantity, 0), 0);
      state.totalQuantity = totalQuantity;
      state.totalPrice = state.orders.reduce((sum, order) => sum + (Object.values(order.OrderSizes).reduce((sizeSum, { quantity }) => sizeSum + quantity, 0) * order.price), 0);
    },
    removeOrder: (state, action) => {
      state.orders = state.orders.filter(order => order._id !== action.payload);
      
      // Update totalQuantity and totalPrice
      const totalQuantity = state.orders.reduce((sum, order) => sum + Object.values(order.OrderSizes).reduce((sizeSum, { quantity }) => sizeSum + quantity, 0), 0);
      state.totalQuantity = totalQuantity;
      state.totalPrice = state.orders.reduce((sum, order) => sum + (Object.values(order.OrderSizes).reduce((sizeSum, { quantity }) => sizeSum + quantity, 0) * order.price), 0);
    },
    updateOrder: (state, action) => {
      const { _id, sizes } = action.payload;

      state.orders = state.orders.map(order => {
        if (order._id === _id) {
          const updatedOrderSizes = { ...order.OrderSizes };

          // Update the sizes in the OrderSizes object
          Object.entries(sizes).forEach(([size, { quantity }]) => {
            if (updatedOrderSizes[size]) {
              updatedOrderSizes[size] = {
                ...updatedOrderSizes[size],
                quantity,
              };
            }
          });

          // Calculate total quantity and price for this specific order
          const totalQuantity = Object.values(updatedOrderSizes).reduce((sum, { quantity }) => sum + quantity, 0);
          const orderTotalPrice = totalQuantity * order.price; // Assuming each order has a `price` property

          return { ...order, OrderSizes: updatedOrderSizes, totalQuantity, totalPrice: orderTotalPrice };
        }
        return order;
      });

      // Update the overall totalPrice and totalQuantity across all orders
      state.totalQuantity = state.orders.reduce((sum, order) => sum + Object.values(order.OrderSizes).reduce((sizeSum, { quantity }) => sizeSum + quantity, 0), 0);
      state.totalPrice = state.orders.reduce((sum, order) => sum + (Object.values(order.OrderSizes).reduce((sizeSum, { quantity }) => sizeSum + quantity, 0) * order.price), 0);
    },
    clearOrders: (state) => {
      state.orders = [];
      state.totalQuantity = 0;
      state.totalPrice = 0;
    },
  },
});

export const { addOrder, removeOrder, updateOrder, clearOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
