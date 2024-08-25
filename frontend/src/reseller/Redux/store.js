import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import ordersReducer from './ordersSlice';

// Persist configuration
const persistConfig = {
  key: 'root',
  storage,
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, ordersReducer);

const store = configureStore({
  reducer: {
    orders: persistedReducer,
  },
});

export const persistor = persistStore(store);
export default store;
