import Item from "antd/es/list/Item";
import { adminInstance } from "../../Instance";

export const generatePhoneOtp = async (phoneNumber) => {
  try {
    console.log(phoneNumber);

    const response = await adminInstance.post("request-otp", { phoneNumber });
    console.log("OTP Response:", response);
    return response.data;
  } catch (error) {
    console.error("Error generating OTP:", error);
    throw error.response ? error.response.data : new Error(error.message);
  }
};

export const verifyOtp = async (phoneNumber, otp) => {
  try {
    const response = await adminInstance.post("/verify-otp", {
      phoneNumber,
      otp,
    });
    console.log("verify-otp response:", response);
    return response.data;
  } catch (error) {
    console.error("Error generating OTP:", error);
    throw error.response ? error.response.data : new Error(error.message);
  }
};

export const createUser = async (data) => {
  try {
    const response = await adminInstance.post("/adduser", data);
    console.log("verify-otp response:", response);
    return response.data;
  } catch (error) {
    console.error("Error createUser:", error);
    throw error.response ? error.response.data : new Error(error.message);
  }
};

export const uploadProducts = async (data) => {
  try {
    const response = await adminInstance.post("/addproducts", data, {});
    console.log("addproduct response:", response);
    return response.data;
  } catch (error) {
    console.error("Error addproduct:", error);
    throw error.response ? error.response.data : new Error(error.message);
  }
};

export const ManageOutOffStock = async (data) => {
  try {
    // Create a FormData object
    const formData = new FormData();

    // Append data fields to FormData
    data.forEach((item, index) => {
      console.log(item);
      
      formData.append(`products[${index}][name]`, item.name);
      formData.append(`products[${index}][edition]`, item.edition);
      formData.append(`products[${index}][price]`, item.price);

      // Append sizes array as individual fields
      item.sizes.forEach((size, sizeIndex) => {
        formData.append(`products[${index}][sizes][${sizeIndex}]`, size);
      });

      // Append images (assuming images is an array of files or objects)
      item.images.forEach((image, imageIndex) => {
        console.log(image);
        
        // If `image.uid` is the file name, you need the actual file object instead
        formData.append(`products[${index}][images][${imageIndex}]`, image.file); // Replace `image.file` with the actual file object
      });
    });

    // Send the FormData via axios
    const response = await adminInstance.post("/", formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log("addproduct response:", response);

    return response.data;
  } catch (error) {
    console.error("Error addproduct:", error);
    throw error.response ? error.response.data : new Error(error.message);
  }
};
