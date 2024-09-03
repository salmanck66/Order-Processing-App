import React, { useEffect, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import NavBar from "../Specific/NavBar";
import { verifyUser } from '../Api/getApi';
const ProtectedRouteReseller = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Import and use location hook
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const res = await verifyUser();
        console.log('Verification response:', res);
        // Additional logic can be added here based on response
      } catch (error) {
        console.error('Error verifying user:', error);
        console.log('Redirecting to login due to error');
        // Optionally, use a notification or toast here
        navigate('/'); // Ensure this path is correct
      } finally {
        setLoading(false);
      }
    };

    checkToken();
  }, [navigate, location.pathname]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      <NavBar />
      <div className="mx-1 rounded-lg rounded-t-none overflow-y-scroll no-scrollbar">
        <Outlet />
      </div>
    </div>
  );
};

export default ProtectedRouteReseller;
