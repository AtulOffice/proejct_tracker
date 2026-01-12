import axios from "axios";
import { store } from "../redux/store";
import { logoutUser, setAccessToken } from "../redux/slices/authSlice";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
    timeout: 20000,
});

apiClient.interceptors.request.use(
    (config) => {
        const token = store.getState()?.auth?.accessToken;

        config.headers = config.headers || {};

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);
const refreshAccessToken = async () => {
    console.log("✅ calling refresh-token API...");
    const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/refresh-token`,
        { withCredentials: true }
    );
    console.log("✅ calling refresh-token API...");
    return data?.accessToken;
};
apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const status = error?.response?.status;
        if (originalRequest?.url?.includes("/logout")) {
            return Promise.reject(error);
        }
        if (status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const newAccessToken = await refreshAccessToken();

                if (!newAccessToken) {
                    store.dispatch(logoutUser());
                    return Promise.reject(error);
                }

                store.dispatch(setAccessToken(newAccessToken));
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

                return apiClient(originalRequest);
            } catch (refreshError) {
                store.dispatch(logoutUser());
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
