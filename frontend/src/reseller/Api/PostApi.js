import { userInstance } from "../../Instance";

export const recallerLogin = async (data) => {
    try {
        const response = await userInstance.post(`/login`, data);
        
        return response.data;
    } catch (error) {
        console.error('Error searching products:', error);
        throw error;
    }
};

export const SearchProducts = async (query) => {
    try {
        const response = await userInstance.get(`/products`, {
         
            params: { q: query }
        });
        
        return response.data;
    } catch (error) {
        console.error('Error searching products:', error);
        throw error;
    }
};

export const submitorder = async (data) => {
    try {
        const response = await userInstance.post('/submitorder', data, {
        });
        return response.data;
    } catch (error) {
        console.error('Error submitting order:', error); // Updated error message
        throw error;
    }
};

export const resetPassword = async (data) => {
    try {
        const response = await userInstance.post(`resetpassword`, data);
        
        return response.data;
    } catch (error) {
        console.error('Error resetting password:', error);
        throw error;
    }
};




export const fetchProducts = async (data) => {
    console.log(data);
    
    try {
        const response = await userInstance.post(`/productsearch`, data);
        return response.data;
    } catch (error) {
        console.error('Error productsearch password:', error);
        throw error;
    }
};



export const uploadFile = async (data) => {
    try {
        const response = await userInstance.post('/label-save', data, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        console.log(response);
        return response;
        
    } catch (error) {
        console.error('Error resetting password:', error);
        throw error;
    }
};

export const generatePhoneOtp = async (phoneNumber) => {
    try {
      console.log(phoneNumber);
  
      const response = await userInstance.post('request-otp', { phoneNumber });
      console.log('OTP Response:', response);
      return response.data;
    } catch (error) {
      console.error('Error generating OTP:', error);
      throw error.response ? error.response.data : new Error(error.message);
    }
  };

  