import { publicApiClient } from "../axiosInstance/axiosInstance";
import type { IUserSignUp } from "../../interface/user";

const PublicApi = publicApiClient

export const registerUser = async (formData: IUserSignUp) => {    
    const response = await PublicApi.post('/auth/register', formData);
    return response.data;
}

export const LoginUser = async (email: string, password: string) => {
    const response = await PublicApi.post('/auth/login', { email, password});
    return response.data
}

export const logoutUser = async () => {
    const response = await PublicApi.post('/auth/logout');
    return response.data;  
}