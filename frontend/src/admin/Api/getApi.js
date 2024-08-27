import { adminInstance } from "../../Instance";

export const dashboard = async (phoneNumber, otp) => {
    try {
      const response = await adminInstance.get('/', { phoneNumber, otp });
      console.log('verify-otp response:', response);
      return response.data;
    } catch (error) {
      console.error('Error generating dashboard:', error);
      throw error.response ? error.response.data : new Error(error.message);
    }
  };

  export const verifyAdmin = async (phoneNumber, otp) => {
    try {
      const response = await adminInstance.get('/verify-admin', { phoneNumber, otp });
      console.log('verify Admin:', response);
      return response;
    } catch (error) {
      console.error('Error generating OTP:', error);
      throw error.response ? error.response.data : new Error(error.message);
    }
  };