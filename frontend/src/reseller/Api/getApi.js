import { userInstance } from "../../Instance";



export const fetchOrders = async ( ) => {
    try {
        const response = await userInstance.get(`/recent-orders`, );
        
        return response.data;
    } catch (error) {
        console.error('Error searching products:', error);
        throw error;
    }
};

export const fetchOrder = async (orderId ) => {
    try {
        const response = await userInstance.get(`/eachorder/${orderId}`, );
        
        return response.data;
    } catch (error) {
        console.error('Error searching products:', error);
        throw error;
    }
};

export const fetchProfile = async ( ) => {
    try {
        const response = await userInstance.get(`/fetchProfile/`, );
        
        return response.data;
    } catch (error) {
        console.error('Error searching products:', error);
        throw error;
    }
};

export const logout = async ( ) => {
    try {
        const response = await userInstance.post(`/logout`, );
        
        return response.data;
    } catch (error) {
        console.error('Error searching products:', error);
        throw error;
    }
};

export const verifyUser = async ( ) => {
    try {
        const response = await userInstance.get(`/checkuser`, );
        
        return response.data;
    } catch (error) {
        console.error('Error searching products:', error);
        throw error;
    }
};

