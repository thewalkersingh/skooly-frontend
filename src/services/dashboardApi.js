import api from "./api";

const dashboardApi = {
  getStudentCount: (schoolId) => api.get(`/students`, { params: { schoolId, size: 1 } }),
  getTeacherCount: (schoolId) => api.get(`/teachers`, { params: { schoolId, size: 1 } }),
  getClassCount: (schoolId) => api.get(`/classrooms`, { params: { schoolId, size: 1 } }),
};

export default dashboardApi;