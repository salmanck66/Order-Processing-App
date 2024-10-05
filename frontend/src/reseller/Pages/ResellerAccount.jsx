import React, { useEffect, useState } from 'react';
import { Profile } from '../Components/Profile';
import ListCustomers from '../Components/ListCustomers';
import { fetchProfile } from '../Api/getApi';
import { Spin, Alert } from 'antd'; // Import Ant Design components for UX improvements
import 'antd/dist/reset.css'; // Import Ant Design styles

const ResellerAccount = () => {
  const [customers, setCustomers] = useState([]);
  const [originalCustomers, setOriginalCustomers] = useState([]); // Store the original data
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getProfileData = async () => {
      try {
        const response = await fetchProfile();
        const customerData = response.customers 
        setCustomers(customerData);
        console.log(response.customers);
        
        setOriginalCustomers(customerData); // Store original customer data
        setProfile(response.reseller || {});
      } catch (error) {
        setError('Error fetching profile data');
        console.error('Error fetching profile data:', error);
      } finally {
        setLoading(false);
      }
    };

    getProfileData();
  }, []);

  // Function to reset customers to original data
  const resetCustomers = () => {
    setCustomers(originalCustomers);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className='w-full p-4 md:p-10 grid grid-cols-1 md:grid-cols-4 gap-4'>
      <div className="md:col-span-3">
        {error ? (
          <Alert message={error} type="error" showIcon className="mb-4" />
        ) : (
          <ListCustomers customers={customers} setCustomers={setCustomers} resetCustomers={resetCustomers} />
        )}
      </div>
      <div className="md:col-span-1">
        {profile ? (
          <Profile profile={profile} />
        ) : (
          <div className="p-4 bg-white rounded-lg shadow-md">Profile data not available</div>
        )}
      </div>
    </div>
  );
};

export default ResellerAccount;
