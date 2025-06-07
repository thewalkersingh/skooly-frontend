import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api';

export const fetchTeachers = () =>
  axios.get(`${API_BASE}/teachers/all`).then(response => response.data);

export const createTeacher = (teacher) =>
  axios.post(`${API_BASE}/teachers`, teacher).then(response => response.data);

export const updateTeacher = (id, teacher) =>
  axios.put(`${API_BASE}/teachers/${id}`, teacher).then(response => response.data);

export const deleteTeacher = (id) =>
  axios.delete(`${API_BASE}/teachers/${id}`).then(response => response.data);