import axios from "axios";
import { store } from "../redux/store";
import { logoutUser, setAccessToken } from "../redux/slices/authSlice";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    timeout: 20000,
});

apiClient.interceptors.request.use((config) => {
    const token = store.getState()?.auth?.accessToken;

    config.headers = config.headers || {};
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (error) prom.reject(error);
        else prom.resolve(token);
    });
    failedQueue = [];
};

const refreshAccessToken = async () => {
    const { data } = await apiClient.post("/refresh-token");
    return data?.accessToken;
};

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error?.response?.status;

        if (!originalRequest) return Promise.reject(error);
        if (originalRequest.url?.includes("/logout")) {
            return Promise.reject(error);
        }

        if (originalRequest.url?.includes("/refresh-token")) {
            const refreshStatus = error?.response?.status;

            if (refreshStatus === 401 || refreshStatus === 403) {
                processQueue(error, null);
                store.dispatch(logoutUser());
            }

            return Promise.reject(error);
        }
        if (status !== 401) return Promise.reject(error);

        if (originalRequest._retry) return Promise.reject(error);
        originalRequest._retry = true;
        if (isRefreshing) {
            return new Promise((resolve, reject) => {
                failedQueue.push({ resolve, reject });
            })
                .then((newToken) => {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return apiClient(originalRequest);
                })
                .catch((err) => Promise.reject(err));
        }
        isRefreshing = true;

        try {
            const newAccessToken = await refreshAccessToken();

            if (!newAccessToken) {
                store.dispatch(logoutUser());
                processQueue(new Error("No access token received"), null);
                return Promise.reject(error);
            }
            store.dispatch(setAccessToken(newAccessToken));
            processQueue(null, newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return apiClient(originalRequest);
        } catch (refreshErr) {
            processQueue(refreshErr, null);
            store.dispatch(logoutUser());
            return Promise.reject(refreshErr);
        } finally {
            isRefreshing = false;
        }
    }
);

export default apiClient;
