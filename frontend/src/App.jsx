import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './Routes/Routes';  // Ensure you're importing the default export
import { Provider } from 'react-redux';
import store from './reseller/Redux/store';
function App() {

  return (
    <Provider store={store}>

    <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
