import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../admin/pages/Dashboard";
import ProtectedRouts from "../admin/utils/ProtectedRouts";
import Orders from "../admin/pages/Orders";
import Account from "../admin/pages/Account";
import Products from "../admin/pages/Products";

export const Routes = createBrowserRouter([
  {
    path: "/",
    children: [
      {
        path: "admin",
        children: [
          {
            path: "",
            element: <ProtectedRouts />,
            children: [
              {
                path: "",
                element: <Dashboard />,
              },
              {
                path: "orders",
                element: <Orders />,
              },
              {
                path: "products",
                element: <Products />,
              },
              {
                path: "account",
                element: <Account />,
              },
            ],
          },
        ],
      },
    ],
  },
]);

export default Routes;
