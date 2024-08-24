import React from 'react';
import { Input, Button, notification } from 'antd';
import { useForm, Controller } from 'react-hook-form';
import { recallerLogin } from '../Api/PostApi';

const ResellersLogin = () => {
  const { control, handleSubmit, formState: { errors, isSubmitting }, clearErrors } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await recallerLogin(data); // Assuming this function posts the login data to your API
        // If the login is successful, show a success notification
        notification.success({
          message: 'Login Successful',
          description: 'You have successfully logged in.',
        });

      
    } catch (error) {
      // Handle any other errors that may occur during the API call
      notification.error({
        message: 'Login Error',
        description: error.response.data.message||'An unexpected error occurred. Please try again later.',
      });
      console.error('Login error:', error);
    }
  };

  return (
    <div className="flex justify-center items-center bg-primary min-h-screen">
      <div className="border shadow-2xl md:w-[400px] p-10 rounded-lg bg-white">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Phone Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <Controller
              name="phone"
              control={control}
              defaultValue=""
              rules={{
                required: 'Phone number is required',
                pattern: {
                  value: /^[0-9]{10}$/,
                  message: 'Please enter a valid 10-digit phone number',
                },
              }}
              render={({ field }) => (
                <Input
                  {...field}
                  placeholder="Enter your phone number"
                  status={errors.phone ? 'error' : ''}
                  onChange={(e) => {
                    field.onChange(e);
                    clearErrors('phone');
                  }}
                />
              )}
            />
            {errors.phone && <p className="text-red-500 text-xs">{errors.phone.message}</p>}
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <Controller
              name="password"
              control={control}
              defaultValue=""
              rules={{
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters long',
                },
              }}
              render={({ field }) => (
                <Input.Password
                  {...field}
                  placeholder="Enter your password"
                  status={errors.password ? 'error' : ''}
                  onChange={(e) => {
                    field.onChange(e);
                    clearErrors('password');
                  }}
                />
              )}
            />
            {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
          </div>

          {/* Submit Button */}
          <div>
            <Button className="bg-neutral" type="primary" htmlType="submit" block loading={isSubmitting}>
              Login
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResellersLogin;
