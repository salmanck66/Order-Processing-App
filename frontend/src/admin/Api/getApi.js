import { adminInstance } from "../../Instance";

export const dashboard = async (phoneNumber, otp) => {
    try {
      const response = await adminInstance.get('/', { phoneNumber, otp });
      console.log('verify-otp response:', response);
      return response.data;
    } catch (error) {
      console.error('Error generating OTP:', error);
      throw error.response ? error.response.data : new Error(error.message);
    }
  };