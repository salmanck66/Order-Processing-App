import axios from "axios"; 

export const adminInstance = axios.create({
    baseURL: `${import.meta.env.VITE_URL}/admin`,
    withCredentials: true
});

export const userInstance = axios.create({
    baseURL: `${import.meta.env.VITE_URL}/user`,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        timeout: 1000
    }
});
