import axios from "axios";
import store from "../../redux/store";
import { loginSuccess, logOut } from "../../redux/authSlice";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const publicApiClient = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true
})

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
})

axiosInstance.interceptors.request.use(
    (config) => {
        const state = store.getState();
        const token = state.auth.token;

        if(token) {
            config.headers = config.headers || {};
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error)
    }
)

axiosInstance.interceptors.response.use(
    (response) =>  response,
    async (error) => {
        console.log(error, 'error');
        
        const originalRequest = error.config;

        if(originalRequest && error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                console.log('here');
                
                const response = await axios.post<{token: string}>(`${API_BASE_URL}/api/auth/refresh-token`, 
                    {},
                    {withCredentials: true}
                )

                console.log('response');
                

                if(response.status === 200) {
                    store.dispatch(loginSuccess({token: response.data.token}));
                    originalRequest.headers = originalRequest.headers || {};
                    originalRequest.headers['Authorization'] = `Bearer ${response.data.token}`;
                    return axiosInstance(originalRequest)
                }

            } catch (error) {
                console.log('refresh Token Error', error);
                store.dispatch(logOut())
                return Promise.reject(error)
            }
        }

        return Promise.reject(error)
    }
)

export { publicApiClient, axiosInstance }