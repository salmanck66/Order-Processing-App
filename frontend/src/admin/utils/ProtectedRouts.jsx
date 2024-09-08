import { Outlet, Navigate } from "react-router-dom";
import AdminLayout from "../pages/Layout";
import { verifyAdmin } from "../Api/getApi";
import { useEffect, useState } from "react";
import { Spin } from "antd"; // Assuming you are using Ant Design for the spinner

const ProtectedRouts = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const response = await verifyAdmin();
        if (response.status === 200) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, []);

  if (loading) {
    // Show loading spinner while checking authentication
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/admin/login" />;
  }

  // Render the admin layout if authenticated
  return (
    <div>
      <AdminLayout />
    </div>
  );
};

export default ProtectedRouts;
