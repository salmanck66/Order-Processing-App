import axios from "axios"; 

export const adminInstance = axios.create({
    baseURL: 'http://localhost:3000/admin',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        timeout: 1000
        }
        
})


export const userInstance = axios.create({
    baseURL: 'http://localhost:3000/user',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
        timeout: 1000
        }
})