import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './Routes/Routes';  // Ensure you're importing the default export

function App() {

  return (
    <RouterProvider router={router} />
  );
}

export default App;
