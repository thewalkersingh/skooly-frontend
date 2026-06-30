// // axiosConfig.js
// import axios from "axios";
//
// const api = axios.create({
//   baseURL: "https://your-render-url.onrender.com",
// });
//
// // Attach token to every request automatically
// api.interceptors.request.use(
//    (config) => {
//      const token = localStorage.getItem("accessToken");
//      if (token) {
//        config.headers.Authorization = `Bearer ${token}`;
//      }
//      return config;
//    },
//    (error) => Promise.reject(error)
// );
//
// // Auto-refresh token on 401
// api.interceptors.response.use(
//    (response) => response,
//    async (error) => {
//      const original = error.config;
//
//      // Token expired → try refresh
//      if (error.response?.status === 401 && !original._retry) {
//        original._retry = true;
//
//        try {
//          const refreshToken = localStorage.getItem("refreshToken");
//          const res = await axios.post(
//             "https://your-render-url.onrender.com/auth/refresh",
//             null,
//             { params: { refreshToken } }
//          );
//
//          const newAccessToken = res.data.data.accessToken;
//          const newRefreshToken = res.data.data.refreshToken;
//
//          localStorage.setItem("accessToken", newAccessToken);
//          localStorage.setItem("refreshToken", newRefreshToken);
//
//          // Retry original request with new token
//          original.headers.Authorization = `Bearer ${newAccessToken}`;
//          return api(original);
//
//        } catch (refreshError) {
//          // Refresh failed → logout
//          localStorage.removeItem("accessToken");
//          localStorage.removeItem("refreshToken");
//          window.location.href = "/login";
//          return Promise.reject(refreshError);
//        }
//      }
//
//      return Promise.reject(error);
//    }
// );
//
// export default api;