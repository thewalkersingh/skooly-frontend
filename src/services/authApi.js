import api from "./api";

const authApi = {
  login: (credentials) => api.post("/auth/login", credentials),
  me: () => api.get("/auth/me"),
  register: (data) => api.post("/auth/register", data),
  refresh: (refreshToken) => api.post("/auth/refresh", { refreshToken }),
  logout: (refreshToken) => api.post("/auth/logout", { refreshToken }),
  forgotPassword: (identifier) => api.post("/auth/forgot-password", { identifier }),
  verifyOtp: (payload) => api.post("/auth/verify-otp", payload),
  resetPassword: (payload) => api.post("/auth/reset-password", payload),
  resendOtp: (identifier, purpose) => api.post("/auth/resend-otp", { identifier, purpose }),
  setPassword: (payload) => api.post("/auth/set-password", payload),
};

export default authApi;