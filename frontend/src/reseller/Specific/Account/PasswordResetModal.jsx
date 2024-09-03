import React, { useState } from 'react';
import { Modal, Form, Input, Button, notification, Tooltip } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { resetPassword } from '../../Api/PostApi';

const PasswordResetModal = ({ isVisible, onClose }) => {
  const { control, handleSubmit, watch, formState: { errors } } = useForm();
  const [passwordHint, setPasswordHint] = useState({
    minLength: false,
    hasSpecialChar: false
  });

  const handlePasswordReset = async (formData) => {
    try {
      const response = await resetPassword(formData);
      
      notification.success({
        message: 'Password Reset Successful',
        description: 'Your password has been successfully reset. You can now log in with your new password.',
        placement: 'topRight',
      });

      console.log('Password reset successful:', response);
      onClose(); // Close the modal after successful reset
    } catch (error) {
      notification.error({
        message: 'Password Reset Failed',
        description: error.response?.data?.message || 'An error occurred while trying to reset your password. Please try again.',
        placement: 'topRight',
      });

      console.error('Password reset failed:', error);
    }
  };

  const newPassword = watch('newPassword');
  const confirmPassword = watch('confirmPassword');

  // Password validation rules
  const minLengthRequirement = 8;
  const specialCharRequirement = /[!@#$%^&*]/;

  // Check password validity
  const updatePasswordHint = (password) => {
    setPasswordHint({
      minLength: password?.length >= minLengthRequirement,
      hasSpecialChar: specialCharRequirement.test(password)
    });
  };

  // Update hints when newPassword changes
  React.useEffect(() => {
    updatePasswordHint(newPassword);
  }, [newPassword]);

  return (
    <Modal
      title="Reset Password"
      visible={isVisible}
      onCancel={onClose}
      footer={null}
    >
      <Form
        layout="vertical"
        onFinish={handleSubmit(handlePasswordReset)}
      >
        <Form.Item
          label="Current Password"
          validateStatus={errors.currentPassword ? 'error' : ''}
          help={errors.currentPassword ? errors.currentPassword.message : ''}
        >
          <Controller
            name="currentPassword"
            control={control}
            defaultValue=""
            rules={{ required: 'Current password is required' }}
            render={({ field }) => (
              <Input.Password
                {...field}
                placeholder="Enter current password"
              />
            )}
          />
        </Form.Item>

        <Form.Item
          label="New Password"
          validateStatus={errors.newPassword ? 'error' : ''}
          help={errors.newPassword ? errors.newPassword.message : ''}
        >
          <Controller
            name="newPassword"
            control={control}
            defaultValue=""
            rules={{
              required: 'New password is required',
              pattern: {
                value: /^(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/,
                message: 'Password must be at least 8 characters long and include at least one special character'
              }
            }}
            render={({ field }) => (
              <Input.Password
                {...field}
                placeholder="Enter new password"
                suffix={
                  <Tooltip title="Password must be at least 8 characters long and include at least one special character">
                    <i className="anticon anticon-info-circle" style={{ fontSize: 16, color: '#1890ff' }} />
                  </Tooltip>
                }
              />
            )}
          />
          <div style={{ color: 'gray', marginTop: '0.5rem' }} className='flex gap-4 text-red-500 '>
            <p style={{ display: passwordHint.minLength ? 'none' : 'block' }}>
              <i className="anticon anticon-close-circle" style={{ color: 'red' }} /> Minimum 8 characters
            </p>
            <p style={{ display: passwordHint.hasSpecialChar ? 'none' : 'block' }}>
              <i className="anticon anticon-close-circle" style={{ color: 'red' }} /> At least one special character
            </p>
          </div>
        </Form.Item>

        <Form.Item
          label="Confirm New Password"
          validateStatus={errors.confirmPassword ? 'error' : ''}
          help={errors.confirmPassword ? errors.confirmPassword.message : ''}
        >
          <Controller
            name="confirmPassword"
            control={control}
            defaultValue=""
            rules={{
              required: 'Please confirm your new password',
              validate: value => value === newPassword || 'Passwords do not match'
            }}
            render={({ field }) => (
              <Input.Password
                {...field}
                placeholder="Confirm new password"
              />
            )}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Reset Password
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PasswordResetModal;
