import React, { useState } from 'react';
import { FaRegUser } from 'react-icons/fa';
import PasswordResetModal from '../Specific/Account/PasswordResetModal';
export const Profile = ({ profile }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return (
    <div className='md:w-full w-[350px] mx-auto sticky top-10 md:col-span-1 shadow-lg hover:shadow-2xl p-0 m-0 rounded-xl h-fit border flex flex-col'>
      <div className='relative flex flex-col items-center'>
        <div className='bg-ternary w-full h-2/5 rounded-t-xl z-10 absolute top-0 left-0'>
          {/* Optional header content */}
        </div>
        <div className='absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/3 z-50'>
          <div className='w-32 h-32 flex items-center justify-center rounded-full bg-black border-4 border-white'>
            <FaRegUser size={64} color="white" />
          </div>
        </div>
        <div className='mt-40 text-center'>
          <h3 className='text-xl font-bold mb-2'>{profile.name || 'John Doe'}</h3>
          <p className='text-gray-700'>Email: {profile.email || 'johndoe@example.com'}</p>
          <p className='text-gray-700'>Phone: {profile.phone || '(123) 456-7890'}</p>
          <p className='text-gray-700'>Location: {profile.location || 'City, Country'}</p>
        </div>
      </div>
      <div className='mt-auto p-4'>
        <div className='flex justify-center'>
          <p
            className='px-4 py-2 rounded-md cursor-pointer transition duration-300'
            onClick={showModal}
          >
            Password Reset?
          </p>
        </div>
      </div>
      
      <PasswordResetModal isVisible={isModalVisible} onClose={closeModal} />
    </div>
  );
};
