import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api';

export const fetchAttendanceRecords = () =>
  axios.get(`${API_BASE}/attendance`).then(response => response.data);

export const fetchAttendanceByStudent = (studentId) =>
  axios.get(`${API_BASE}/attendance/student/${studentId}`).then(response => response.data);

export const fetchAttendanceByDate = (date) =>
  axios.get(`${API_BASE}/attendance/date/${date}`).then(response => response.data);

export const markAttendance = (attendance) =>
  axios.post(`${API_BASE}/attendance`, attendance).then(response => response.data);