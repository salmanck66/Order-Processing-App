import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { notification } from 'antd';
import { generatePhoneOtp, verifyOtp } from '../Api/postApi';
import { useNavigate } from 'react-router-dom';
import useAuthenticatedRedirect from '../utils/useAuthenticatedRedirect';
const Login = () => {
  const [otpSent, setOtpSent] = React.useState(false);
  const [phoneNumber, setPhoneNumber] = React.useState('');
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { isTokenValid, loading } = useAuthenticatedRedirect(); // Use the custom hook

  // Show notification
  const openNotification = (type, message) => {
    notification[type]({
      message: message,
    });
  };

  // Handle phone number submission
  const onPhoneSubmit = async (data) => {
    try {
      const response = await generatePhoneOtp(data.phone);
      console.log('OTP generated successfully:', response);
      setOtpSent(true);
      setPhoneNumber(data.phone);
      openNotification('success', 'OTP has been sent to your phone number.');
    } catch (error) {
      console.error('Failed to generate OTP:', error);
      openNotification('error', error.message);
    }
  };

  // Handle OTP submission
  const onOtpSubmit = async (data) => {
    try {
      const response = await verifyOtp(phoneNumber, data.otp);
      console.log('OTP verified successfully:', response);
      openNotification('success', 'OTP verified successfully. You are now logged in.');
      navigate('/admin');
    } catch (error) {
      console.error('Failed to verify OTP:', error);
      openNotification('error', error.message);
    }
  };

  // Redirect if the user is already authenticated
  useEffect(() => {
    if (!loading && isTokenValid) {
      navigate('/admin');
    }
  }, [isTokenValid, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>; // Display loading state while checking authentication
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-700">Admin Login</h2>

        {!otpSent ? (
          <form onSubmit={handleSubmit(onPhoneSubmit)} className="space-y-6">
            <div className="space-y-1">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                id="phone"
                type="tel"
                className={`w-full px-3 py-2 border ${
                  errors.phone ? 'border-red-500' : 'border-gray-300'
                } rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                {...register('phone', {
                  required: 'Phone number is required',
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: 'Invalid phone number',
                  },
                })}
              />
              {errors.phone && (
                <p className="text-sm text-red-500">{errors.phone.message}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Generate OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit(onOtpSubmit)} className="space-y-6">
            <div className="space-y-1">
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                Enter OTP
              </label>
              <input
                id="otp"
                type="text"
                maxLength="6"
                className={`w-full px-3 py-2 border ${
                  errors.otp ? 'border-red-500' : 'border-gray-300'
                } rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                {...register('otp', {
                  required: 'OTP is required',
                  pattern: {
                    value: /^[0-9]{6}$/,
                    message: 'Invalid OTP',
                  },
                })}
              />
              {errors.otp && (
                <p className="text-sm text-red-500">{errors.otp.message}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full px-4 py-2 text-white bg-indigo-600 rounded hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Verify OTP
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
