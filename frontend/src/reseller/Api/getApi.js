import { userInstance } from "../../Instance";



export const fetchOrders = async ( ) => {
    try {
        const response = await userInstance.get(`/fetchOrders`, );
        
        return response.data;
    } catch (error) {
        console.error('Error searching products:', error);
        throw error;
    }
};

export const fetchOrder = async ( ) => {
    try {
        const response = await userInstance.get(`/fetchOrder`, );
        
        return response.data;
    } catch (error) {
        console.error('Error searching products:', error);
        throw error;
    }
};