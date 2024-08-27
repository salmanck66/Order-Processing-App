import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Dashboard from "../admin/pages/Dashboard";
import ProtectedRouts from "../admin/utils/ProtectedRouts";
import Orders from "../admin/pages/Orders";
import Account from "../admin/pages/Account";
import Products from "../admin/pages/Products";
import Login from "../admin/pages/login";
import ProductUpload from "../admin/pages/ProductUpload";
import RecallersLogin from "../reseller/Pages/ResellersLogin";
import ProtectedRouteReseller from "../reseller/Utils/ProtectedRouteReseller";
import ResellerDashboard from "../reseller/Pages/ResellerDashboard";
import ResellerProducts from "../reseller/Pages/ResellerProducts";
import ResellerAccount from "../reseller/Pages/ResellerAccount";
import ResellerOrders from "../reseller/Pages/ResellerOrders";
import PreviousOrder from "../reseller/Pages/PreviousOrder";
import OrderDetailByDate from "../reseller/Pages/OrserDetailByDate";

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
              {
                path: "upload",
                element: <ProductUpload />,
              },
            ],
          },
          {
            path: "login",
            element: <Login />,
          },
        ],
      },
      {
        path: "",
        element: <RecallersLogin />,
      },
      {
        path: "reseller",
        element: <ProtectedRouteReseller />,
        children: [
          {
            path: "",
            element: <ResellerDashboard />,
          },
          {
            path: "orders",
            element: <ResellerOrders />,
          },
          {
            path: "products",
            element: <ResellerProducts />,
          },
          {
            path: "account",
            element: <ResellerAccount />,
          },
          {
            path: "previous-orders",
            element: <PreviousOrder />,
          },
          {
            path: "previous-order/:orderId",
            element: <OrderDetailByDate />,
          },
        ],
      },
    ],
  },
]);

export default Routes;
