import { configureStore } from '@reduxjs/toolkit';
import ordersReducer from './ordersSlice';

const store = configureStore({
  reducer: {
    orders: ordersReducer,
  },
});

export default store;
