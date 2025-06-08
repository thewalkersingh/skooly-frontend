import axios from 'axios';

// Safely load the env var
const API_BASE = import.meta.env.VITE_API_BASE;
if (!API_BASE) {
  console.warn('⚠️ VITE_API_BASE is not defined! Falling back to localhost.');
}
const BASE_URL = API_BASE || 'http://localhost:8080/api';

export const fetchTeachers = () =>
  axios.get(`${BASE_URL}/teachers/all`).then(response => response.data);

export const createTeacher = (teacher) =>
  axios.post(`${BASE_URL}/teachers`, teacher).then(response => response.data);

export const updateTeacher = (id, teacher) =>
  axios.put(`${BASE_URL}/teachers/${id}`, teacher).then(response => response.data);

export const deleteTeacher = (id) =>
  axios.delete(`${BASE_URL}/teachers/${id}`).then(response => response.data);