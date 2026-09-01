import axios from "axios";
import {useAuthStore} from "@/store/authStore";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

const api = axios.create({
    baseURL: `${API_BASE_URL}/v1`,
    headers: {"Content-Type": "application/json"},
});

// ── REQUEST: attach access token ──
api.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().accessToken;
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// ── RESPONSE: handle 401 with refresh ──
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const original = error.config;

        if (error.response?.status === 401 && !original._retry) {
            if (isRefreshing) {
                // Queue this request until refresh completes
                return new Promise((resolve, reject) => {
                    failedQueue.push({resolve, reject});
                })
                    .then((token) => {
                        original.headers.Authorization = `Bearer ${token}`;
                        return api(original);
                    })
                    .catch((err) => Promise.reject(err));
            }

            original._retry = true;
            isRefreshing = true;

            const {refreshToken, setTokens, logout} = useAuthStore.getState();

            try {
                const res = await axios.post(
                    `${API_BASE_URL}/v1/auth/refresh`,
                    {refreshToken},
                    {headers: {"Content-Type": "application/json"}}
                );

                const {accessToken, refreshToken: newRefresh} = res.data.data;
                setTokens(accessToken, newRefresh);
                processQueue(null, accessToken);

                original.headers.Authorization = `Bearer ${accessToken}`;
                return api(original);
            } catch (refreshError) {
                processQueue(refreshError, null);
                logout();
                window.location.href = "/login";
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        const message =
            error.response?.data?.message ||
            error.response?.data?.error ||
            error.message ||
            "Something went wrong";

        return Promise.reject(new Error(message));
    }
);

export default api;