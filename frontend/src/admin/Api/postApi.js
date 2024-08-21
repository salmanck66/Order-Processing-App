import { adminInstance } from "../../Instance";

export const generatePhoneOtp = async (phone) => {
  try {
    const response = await adminInstance.post('/request-otp', { phone });
    console.log('OTP Response:', response);
    return response.data;
  } catch (error) {
    console.error('Error generating OTP:', error);
    throw error.response ? error.response.data : new Error(error.message);
  }
};

export const verifyOtp = async (phone) => {
    try {
      const response = await adminInstance.post('/verify-otp', { phone });
      console.log('verify-otp response:', response);
      return response.data;
    } catch (error) {
      console.error('Error generating OTP:', error);
      throw error.response ? error.response.data : new Error(error.message);
    }
  };