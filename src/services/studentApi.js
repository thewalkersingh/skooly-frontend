import api from "./api";

export const studentApi = {

   /* getBySchool: (schoolId, page = 0, size = 20) =>
   *    api.get(`/students`, { params: { page, size } }),
    */
   getAll: (page = 0, size = 20) =>
       api.get(`/students`, { params: { page, size } }),
   getById: (studentId) => api.get(`/students/${studentId}`),
   getDetails: (studentId) => api.get(`/students/${studentId}/details`),
   getBySection: (sectionId, page = 0, size = 20) =>
       api.get(`/students/section/${sectionId}`, {params: {page, size}}),

   create: (schoolId, data) => api.post(`/students`, {...data, schoolId}),
   update: (studentId, data) => api.put(`/students/${studentId}`, data),
   delete: (studentId) => api.delete(`/students/${studentId}`),
};