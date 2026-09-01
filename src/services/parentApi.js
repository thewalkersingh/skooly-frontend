import api from "./api";

export const parentApi = {
  getBySchool: (schoolId, page = 0, size = 100) =>
     api.get(`/parents/school/${schoolId}`, { params: { page, size } }),
};