import { userInstance } from "../../Instance";

const SearchProducts = async (query) => {
    try {
        const response = await userInstance.get(`/search`, {
            params: { q: query }
        });
        
        return response.data;
    } catch (error) {
        console.error('Error searching products:', error);
        throw error;
    }
};

export default SearchProducts;
