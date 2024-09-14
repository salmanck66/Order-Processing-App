import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { PiPlus } from 'react-icons/pi';
import BadgeForm from '../specific/badge/BadgeForm';
import BadgeList from '../specific/badge/BadgeList';

const Badge = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [refresh, setRefresh] = useState(false); // Add refresh state

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleBadgeCreated = () => {
    setRefresh(prev => !prev); // Toggle refresh state to rerender BadgeList
  };

  return (
    <div className='bg-white shadow-2xl p-10'>
      <div className='flex justify-between'>
        <h1 className='text-xl font-mono'>Badges</h1>
        <Button type='primary' onClick={showModal}>
          <PiPlus /> New Badge
        </Button>
      </div>

      <Modal
        title="Create New Badge"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Create"
        cancelText="Cancel"
      >
        <BadgeForm onBadgeCreated={handleBadgeCreated} />
      </Modal>

      <BadgeList key={refresh} /> {/* Pass the refresh key to rerender */}
    </div>
  );
};

export default Badge;
