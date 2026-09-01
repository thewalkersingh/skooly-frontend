import api from "./api";

export const sectionApi = {
  getBySchool: (schoolId, page = 0, size = 100) =>
     api.get(`/sections/school/${schoolId}`, { params: { page, size } }),
  
  getByClassroom: (classroomId) =>
     api.get(`/sections/classroom/${classroomId}`),
  
  getByClassroomPaged: (classroomId, page = 0, size = 100) =>
     api.get(`/sections/classroom/${classroomId}/paged`, { params: { page, size } }),
  
  getWithSubjects: (id) => api.get(`/sections/${id}/with-subjects`),
  getByClassroomWithSubjects: (classroomId) =>
     api.get(`/sections/classroom/${classroomId}/with-subjects`),
  
  getUnassigned: (schoolId) => api.get(`/sections/school/${schoolId}/unassigned`),
  
  getById: (id) => api.get(`/sections/${id}`),
  create: (data) => api.post(`/sections`, data),
  update: (id, data) => api.put(`/sections/${id}`, data),
  delete: (id) => api.delete(`/sections/${id}`),
};