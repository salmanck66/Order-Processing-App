import { adminInstance } from '../../Axios.jsx/Instence';

export const generatePhoneOtp = async (phone) => {
  try {
    const response = await adminInstance.post('/generate-otp', { phone });
    console.log('OTP Response:', response);
    return response.data;
  } catch (error) {
    console.error('Error generating OTP:', error);
    throw error.response ? error.response.data : new Error(error.message);
  }
};

export const otpLogin = async (phone) => {
    try {
      const response = await adminInstance.post('/generate-otp', { phone });
      console.log('OTP Response:', response);
      return response.data;
    } catch (error) {
      console.error('Error generating OTP:', error);
      throw error.response ? error.response.data : new Error(error.message);
    }
  };
