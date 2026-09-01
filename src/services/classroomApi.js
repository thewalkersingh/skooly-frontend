import api from "./api";

export const classroomApi = {
  getBySchool: (schoolId, page = 0, size = 100) =>
     api.get(`/classrooms/school/${schoolId}`, { params: { page, size } }),
  
  getBySchoolAndStatus: (schoolId, status, page = 0, size = 100) =>
     api.get(`/classrooms/school/${schoolId}/status/${status}`, { params: { page, size } }),
  
  getById: (classroomId) => api.get(`/classrooms/id/${classroomId}`),
  getAll: (page = 0, size = 100) => api.get(`/classrooms/all`, { params: { page, size } }),
  create: (data) => api.post(`/classrooms`, data),
  update: (id, data) => api.put(`/classrooms/${id}`, data),
  delete: (id) => api.delete(`/classrooms/${id}`),
};