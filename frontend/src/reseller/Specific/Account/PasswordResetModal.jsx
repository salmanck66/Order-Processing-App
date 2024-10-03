import React, { useState } from 'react';
import { Modal, Form, Input, Button, message } from 'antd';
import { generatePhoneOtp, resetPassword } from '../../Api/PostApi';

const PasswordResetModal = ({ isVisible, onClose }) => {
  const [form] = Form.useForm();
  const [isOtpSent, setIsOtpSent] = useState(false); // State to manage OTP status

  // Handle form submission (OTP + new password)
  const handleOk = () => {
    form.validateFields()
      .then(async (values) => {
        console.log('Form Values:', values);
        
        // Call the resetPassword API with form values
        try {
          await resetPassword(values);
          message.success('Password reset successfully');
          onClose();
        } catch (error) {
          message.error(error?.message || 'Failed to reset password');
          console.error('Error resetting password:', error);
        }
      })
      .catch((info) => {
        console.log('Validation Failed:', info);
      });
  };

  // Handle "Get OTP" button click
  const handleGetOtp = async () => {
    const phoneNumber = form.getFieldValue('phoneNumber');
    if (phoneNumber) {
      try {
        await generatePhoneOtp(phoneNumber);
        message.success('OTP sent successfully');
        setIsOtpSent(true); // Enable OTP input once OTP is sent
      } catch (error) {
        message.error(error?.message || 'Failed to send OTP');
        console.error('Error sending OTP:', error);
      }
    } else {
      form.validateFields(['phoneNumber']);
    }
  };

  return (
    <Modal
      title="Reset Password"
      visible={isVisible}
      onCancel={onClose}
      onOk={handleOk}
      okText="Submit"
      cancelText="Cancel"
      okButtonProps={{ disabled: !isOtpSent }} // Disable "Submit" until OTP is sent
    >
      <Form form={form} layout="vertical">
        {/* Phone Number Input with inline "Get OTP" button */}
        <Form.Item
          label="Phone Number"
          name="phoneNumber"
          rules={[{ required: true, message: 'Please enter your phone number' }]}
        >
          <Input.Group compact>
            <Form.Item
              name="phoneNumber"
              noStyle
              rules={[{ required: true, message: 'Please enter your phone number' }]}
            >
              <Input style={{ width: '70%' }} placeholder="Enter your phone number" />
            </Form.Item>
            <Button style={{ width: '30%' }} type="primary" onClick={handleGetOtp}>
              Get OTP
            </Button>
          </Input.Group>
        </Form.Item>

        {/* OTP Input with 6-digit validation */}
        <Form.Item
          name="otp"
          label="OTP"
          rules={[
            { required: true, message: 'Please enter the OTP' },
            {
              pattern: /^[0-9]{6}$/, // Adjusted to match 6-digit OTP
              message: 'OTP must be exactly 6 digits',
            },
          ]}
        >
          <Input placeholder="Enter the OTP" maxLength={6} />
        </Form.Item>

        {/* New Password Input with 8 characters & 1 special character validation */}
        <Form.Item
          name="newPassword"
          label="New Password"
          rules={[
            { required: true, message: 'Please enter your new password' },
            {
              pattern: /^(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/,
              message: 'Password must be at least 8 characters long and contain at least one special character',
            },
          ]}
        >
          <Input.Password placeholder="Enter your new password" />
        </Form.Item>

        {/* Re-enter New Password Input */}
        <Form.Item
          name="confirmPassword"
          label="Confirm New Password"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Please confirm your new password' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('newPassword') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The two passwords do not match'));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Re-enter your new password" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PasswordResetModal;
