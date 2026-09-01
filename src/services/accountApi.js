import api from "./api";

export const accountApi = {
  getPending: () => api.get(`/auth/pending`),
  approve: (userId) => api.post(`/auth/approve/${userId}`),
  reject: (userId, reason) =>
     api.post(`/auth/reject/${userId}`, new URLSearchParams({ reason }), {
       headers: { "Content-Type": "application/x-www-form-urlencoded" },
     }),
  createAccount: (data) => api.post(`/auth/create-account`, data),
};