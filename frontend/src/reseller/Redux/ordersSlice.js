import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  orders: [],
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
            { available: available ? 1 : 0, quantity: available ? 1 : 0 }
          ])
        ),
      };
      console.log('initializedOrder', initializedOrder);
      state.orders.push(initializedOrder);
    },
    removeOrder: (state, action) => {
      state.orders = state.orders.filter(order => order._id !== action.payload);
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

          return { ...order, OrderSizes: updatedOrderSizes };
        }
        return order;
      });
    },
    clearOrders: (state) => {
      state.orders = [];
    },
  },
});

export const { addOrder, removeOrder, updateOrder, clearOrders } = ordersSlice.actions;
export default ordersSlice.reducer;
