import api from "./api";

const authApi = {
  login: (credentials) => api.post("/auth/login", credentials),
  me: () => api.get("/auth/me"),
  refresh: (refreshToken) => api.post("/auth/refresh", { refreshToken }),
  logout: (refreshToken) => api.post("/auth/logout", { refreshToken }),
  forgotPassword: (identifier) => api.post("/auth/forgot-password", { identifier }),
  verifyOtp: (payload) => api.post("/auth/verify-otp", payload),
  resetPassword: (payload) => api.post("/auth/reset-password", payload),
};

// export const login = async (identifier, password) => {
//   const response = await axios.post("/auth/login", { identifier, password });
//   const { accessToken, refreshToken } = response.data.data;
//
//   // Store in localStorage
//   localStorage.setItem("accessToken", accessToken);
//   localStorage.setItem("refreshToken", refreshToken);
//
//   return response.data.data;
// };

export default authApi;