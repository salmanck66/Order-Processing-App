import React, { useState } from 'react';
import { Button, Modal, Form, Input, notification } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { createUser } from '../Api/postApi';

const Account = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  // React Hook Form setup
  const { control, handleSubmit, formState: { errors } } = useForm();

  // Handle form submission
  const onSubmit = async (data) => {
    console.log('Form Data:', data);
    try {
      const response = await createUser(data);
      notification.success({
        message: 'Success',
        description: 'Account has been successfully added!',
      });
      setIsModalVisible(false); // Close modal on success
    } catch (error) {
      notification.error({
        message: 'Error',
        description: 'Failed to add account. Please try again later.',
      });
    }
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    handleSubmit(onSubmit)(); // Submit the form on OK
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <div className='flex justify-between'>
        <h1 className="text-2xl font-bold mb-4">Accounts</h1>
        <Button
          className="bg-blue-500 text-white border-none hover:bg-blue-600"
          onClick={showModal}
        >
          Add Account
        </Button>
      </div>
      <Modal
        title="Add Account"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            Submit
          </Button>,
        ]}
        style={{ top: 20 }} // Adjust modal top position
        styles={{ body: { padding: '20px' } }} // Updated padding style for modal body
      >
        <Form layout="vertical" className="space-y-4">
          <Form.Item
            label="Name"
            validateStatus={errors.name ? 'error' : ''}
            help={errors.name ? errors.name.message : ''}
          >
            <Controller
              name="name"
              control={control}
              rules={{ required: 'Name is required' }}
              render={({ field }) => (
                <Input
                  {...field}
                  className="rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              )}
            />
          </Form.Item>
          <Form.Item
            label="Phone"
            validateStatus={errors.phone ? 'error' : ''}
            help={errors.phone ? errors.phone.message : ''}
          >
            <Controller
              name="phone"
              control={control}
              rules={{
                required: 'Phone number is required',
                pattern: {
                  value: /^\d{10}$/,
                  message: 'Please enter a valid 10-digit phone number'
                }
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  className="rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              )}
            />
          </Form.Item>
          <Form.Item
            label="Email"
            validateStatus={errors.email ? 'error' : ''}
            help={errors.email ? errors.email.message : ''}
          >
            <Controller
              name="email"
              control={control}
              rules={{
                required: 'Email is required',
                pattern: {
                  value: /.+\@.+\..+/,
                  message: 'Please enter a valid email address'
                }
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  className="rounded-md border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                />
              )}
            />
          </Form.Item>
       
        </Form>
      </Modal>
    </div>
  );
};

export default Account;
