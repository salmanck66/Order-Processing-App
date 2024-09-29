import React from 'react';
import { Form, Input, Button, notification } from 'antd';
import { useForm, Controller } from 'react-hook-form';

const OtpGenerate = () => {
  const { control, handleSubmit, formState: { errors } } = useForm();

  // Handle form submission
  const onSubmit = (formData) => {
    notification.success({
      message: 'OTP Request Sent',
      description: `OTP has been sent to ${formData.phoneNumber}. Please check your phone.`,
      placement: 'topRight',
    });
    console.log('Phone number submitted:', formData.phoneNumber);
  };

  return (
    <div>
      <Form
        layout="vertical"
        onFinish={handleSubmit(onSubmit)}
      >
        <Form.Item
          label="Phone Number"
          validateStatus={errors.phoneNumber ? 'error' : ''}
          help={errors.phoneNumber ? errors.phoneNumber.message : ''}
        >
          <Controller
            name="phoneNumber"
            control={control}
            defaultValue=""
            rules={{
              required: 'Phone number is required',
              pattern: {
                value: /^[0-9]{10}$/,
                message: 'Phone number must be exactly 10 digits'
              }
            }}
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Enter your 10-digit phone number"
                maxLength={10} // Limit input to 10 digits
              />
            )}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            Send OTP
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default OtpGenerate;
