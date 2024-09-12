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


  export const uploadProducts = async (formData) => {
    try {
      
      const response = await adminInstance.post('/addproducts', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log('addproduct response:', response);
      return response.data;
    } catch (error) {
      console.error('Error addproduct:', error);
      throw error.response ? error.response.data : new Error(error.message);
    }
  };
  export const ManageOutOffStock = async (data) => {
    try {
      console.log(data);
      
      const response = await adminInstance.post('/adduser', data);
      console.log('verify-otp response:', response);
      return response.data;
    } catch (error) {
      console.error('Error createUser:', error);
      throw error.response ? error.response.data : new Error(error.message);
    }
  };

// Handle stock update for full stockout
export const onStockSwitchChange = async (data) => {
  try {
    console.log('Stock data:', data);
    const response = await adminInstance.post('/productsizestockout', data);
    console.log('Stock update response:', response);
    return response.data;
  } catch (error) {
    console.error('Error updating stock:', error);
    throw error.response ? error.response.data : new Error(error.message);
  }
};

// Handle stock update for individual size
export const onSizeSwitchChange = async (data) => {
  try {
    console.log('Size update data:', data.sizes);
    const response = await adminInstance.post('/productsizestockout', data);
    console.log('Size update response:', response);
    return response.data;
  } catch (error) {
    console.error('Error updating size:', error);
    throw error.response ? error.response.data : new Error(error.message);
  }
};

export const statusChangeCustomer = async (id, orderId) => {
  try {
    const response = await adminInstance.post('/statuschange',{ id, orderId});
    console.log('statusChangeCustomer:', response);
    return response.data;
  } catch (error) {
    console.error('Error statusChangeCustomer:', error);
    throw error.response ? error.response.data : new Error(error.message);
  }
}

export const submitReseller = async ( orderId) => {
  try {
    const response = await adminInstance.post('/resellerCompleteOrder',{ orderId});
    console.log('statusChangeCustomer:', response);
    return response;
  } catch (error) {
    console.error('Error statusChangeCustomer:', error);
    throw error.response ? error.response.data : new Error(error.message);
  }
}

// API function for badge creation
export const createBadge = async (formData) => {
  try {
    const response = await adminInstance.post('/uploadbadge', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    console.log('uploadbadge:', response);
    return response;
  } catch (error) {
    console.error('Error uploadbadge:', error);
    throw error.response ? error.response.data : new Error(error.message);
  }
};

