import React, { useEffect, useState } from 'react';
import { Profile } from '../Components/Profile';
import ListCustomers from '../Components/listCustomers';
import { fetchProfile } from '../Api/getApi';

const ResellerAccount = () => {
  const [customers, setCustomers] = useState([]);
  const [profile, setProfile] = useState(null); // Initialize with null or appropriate default value

  useEffect(() => {
    const getProfileData = async () => {
      try {
        const response = await fetchProfile();
        console.log(response);

        setCustomers(response.customers || []); // Use default value if response is undefined
        setProfile(response.reseller || {}); // Use default value if response is undefined
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    getProfileData();
  }, []);

  return (
    <div className='grid md:grid-cols-4 md:p-10 w-full  items-center '>
      <ListCustomers customers={customers} />
      {profile && <Profile profile={profile} />} 
    </div>
  );
};

export default ResellerAccount;
