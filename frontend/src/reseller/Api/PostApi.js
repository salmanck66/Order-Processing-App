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
        const response = await userInstance.post(`/submitorder`, data);
        
        return response.data;
    } catch (error) {
        console.error('Error searching products:', error);
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
        const response = await userInstance.post(`fetchProducts`, data);
        return response.data;
    } catch (error) {
        console.error('Error resetting password:', error);
        throw error;
    }
};