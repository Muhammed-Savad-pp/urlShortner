import { axiosInstance } from "../axiosInstance/axiosInstance";

const API = axiosInstance;

export const convertUrl = async (url: string) => {
    const response = await API.post('/url/url-shortner', { url });
    return response.data;
}

export const fetchUrls = async (page: number, limit: number, search: string) => {
    const response = await API.get(`/url/urls?page=${page}&limit=${limit}&search=${search}`)
    return response.data;
} 
