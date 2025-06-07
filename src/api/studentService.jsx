// src/api/studentService.jsx
import axios from 'axios';

// Vite environment variable, or default value if not defined.
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api';

export const fetchStudents = () =>
  axios.get(`${API_BASE}/students/all`).then(response => response.data);

export const createStudent = (student) =>
  axios.post(`${API_BASE}/students`, student).then(response => response.data);

export const updateStudent = (id, student) =>
  axios.put(`${API_BASE}/students/${id}`, student).then(response => response.data);

export const deleteStudent = (id) =>
  axios.delete(`${API_BASE}/students/${id}`).then(response => response.data);

// If needed: batch creation (returns a success message)
export const createStudentsBatch = (students) =>
  axios.post(`${API_BASE}/students/batch`, students).then(response => response.data);