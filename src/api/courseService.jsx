// src/api/courseService.jsx
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api';

export const fetchCourses = () =>
  axios.get(`${API_BASE}/courses/all`).then(response => response.data);

export const fetchCourseById = (id) =>
  axios.get(`${API_BASE}/courses/${id}`).then(response => response.data);

export const createCourse = (course) =>
  axios.post(`${API_BASE}/courses`, course).then(response => response.data);

export const updateCourse = (id, course) =>
  axios.put(`${API_BASE}/courses/${id}`, course).then(response => response.data);

export const deleteCourse = (id) =>
  axios.delete(`${API_BASE}/courses/${id}`).then(response => response.data);

// Fetch teachers and students for dropdown selection
export const fetchTeachers = () =>
  axios.get(`${API_BASE}/teachers/all`).then(response => response.data);

export const fetchStudents = () =>
  axios.get(`${API_BASE}/students`).then(response => response.data);