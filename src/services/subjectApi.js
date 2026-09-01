import api from "./api";

export const subjectApi = {
  getBySchool: (schoolId, page = 0, size = 100) =>
     api.get(`/subjects/school/${schoolId}`, { params: { page, size } }),
  getBySection: (sectionId) => api.get(`/subjects/section/${sectionId}`),
  getById: (id) => api.get(`/subjects/${id}`),
  create: (data) => api.post(`/subjects`, data),
  update: (id, data) => api.put(`/subjects/${id}`, data),
  delete: (id) => api.delete(`/subjects/${id}`),
};