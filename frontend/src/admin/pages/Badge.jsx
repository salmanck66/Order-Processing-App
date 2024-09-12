import { Button, Modal } from 'antd'
import React, { useState } from 'react'
import { PiPlus } from 'react-icons/pi'
import BadgeForm from '../specific/badge/BadgeForm';

const Badge = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className='bg-white shadow-2xl p-10'>
      <div className='flex justify-between'>
        <h1 className='text-xl font-mono'>
          Badges
        </h1>
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
        <BadgeForm/>
      </Modal>
    </div>
  )
}

export default Badge;
