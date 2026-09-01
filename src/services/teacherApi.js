import api from "./api";

export const teacherApi = {
  getBySchool: (schoolId, page = 0, size = 100) =>
     api.get(`/teachers/school/${schoolId}`, { params: { page, size } }),
  
  searchByName: (schoolId, name, page = 0, size = 100) =>
     api.get(`/teachers/school/${schoolId}/search`, { params: { name, page, size } }),
  
  getById: (teacherId) => api.get(`/teachers/${teacherId}`),
  getUnassigned: (schoolId) => api.get(`/teachers/school/${schoolId}/unassigned`),
  getBySubject: (subjectId) => api.get(`/teachers/subject/${subjectId}`),
  getSections: (teacherId) => api.get(`/teachers/${teacherId}/sections`),
  
  create: (data) => api.post(`/teachers`, data),
  update: (teacherId, data) => api.put(`/teachers/${teacherId}`, data),
  updateStatus: (teacherId, status) => api.patch(`/teachers/${teacherId}/status/${status}`),
  delete: (teacherId) => api.delete(`/teachers/${teacherId}`),
};