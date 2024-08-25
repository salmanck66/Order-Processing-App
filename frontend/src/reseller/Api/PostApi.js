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