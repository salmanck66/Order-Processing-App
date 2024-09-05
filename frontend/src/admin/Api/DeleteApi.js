import { adminInstance } from "../../Instance";

export const deleteProduct = async (id) => {
    try {
      
      const response = await adminInstance.delete(`/deleteproduct/${id}`,);
      console.log('deleteProduct', response);
      return response.data;
    } catch (error) {
      console.error('Error deleteProduct:', error);
      throw error.response ? error.response.data : new Error(error.message);
    }
  };

  export const deleteMultipleProductsByIds = async (selectedRowKeys) => {
    try {
      const response = await adminInstance.delete(`/deleteMultipleProductsByIds`, {
        data: { ids: selectedRowKeys },
      });
      console.log('deleteProduct', response);
      return response.data;
    } catch (error) {
      console.error('Error deleteProduct:', error);
      throw error.response ? error.response.data : new Error(error.message);
    }
  };
  
  