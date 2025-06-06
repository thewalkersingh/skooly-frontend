import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api';

export const fetchSchools = () =>
  axios.get(`${API_BASE}/schools/all`).then(res => res.data);

export const createSchool = (school) =>
  axios.post(`${API_BASE}/schools`, school).then(res => res.data);

export const updateSchool = (id, school) =>
  axios.put(`${API_BASE}/schools/${id}`, school).then(res => res.data);

export const deleteSchool = (id) =>
  axios.delete(`${API_BASE}/schools/${id}`);

export const createSchoolsBatch = (schools) =>
  axios.post(`${API_BASE}/schools/batch`, schools).then(res => res.data);