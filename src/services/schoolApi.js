import api from "./api";

export const schoolApi = {
  getAll: (page = 0, size = 20) => api.get(`/schools/all`, { params: { page, size } }),
  getByStatus: (status, page = 0, size = 20) => api.get(`/schools/status/${status}`, { params: { page, size } }),
  searchByName: (name, page = 0, size = 20) => api.get(`/schools/name/${name}`, { params: { page, size } }),
  getById: (id) => api.get(`/schools/${id}`),
  create: (data) => api.post(`/schools`, data),
  update: (id, data) => api.patch(`/schools/${id}/request`, data),
  updateStatus: (schoolId, status) =>
     api.put(`/schools/${schoolId}/status`, new URLSearchParams({ schoolId, status }), {
       headers: { "Content-Type": "application/x-www-form-urlencoded" },
     }),
  getPublic: (page = 0, size = 100) =>
     api.get(`/schools/public`, { params: { page, size } }),
};