import { adminInstance } from "../../Instance";

export const generatePhoneOtp = async (phoneNumber) => {
  try {
    console.log(phoneNumber);

    const response = await adminInstance.post('request-otp', { phoneNumber });
    console.log('OTP Response:', response);
    return response.data;
  } catch (error) {
    console.error('Error generating OTP:', error);
    throw error.response ? error.response.data : new Error(error.message);
  }
};

export const verifyOtp = async (phoneNumber, otp) => {
    try {
      const response = await adminInstance.post('/verify-otp', { phoneNumber, otp });
      console.log('verify-otp response:', response);
      return response.data;
    } catch (error) {
      console.error('Error generating OTP:', error);
      throw error.response ? error.response.data : new Error(error.message);
    }
  };

  export const createUser = async (data) => {
    try {
      const response = await adminInstance.post('/adduser', data);
      console.log('verify-otp response:', response);
      return response.data;
    } catch (error) {
      console.error('Error createUser:', error);
      throw error.response ? error.response.data : new Error(error.message);
    }
  };