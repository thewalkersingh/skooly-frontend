import React, {useEffect, useState} from 'react';
import {createTeacher, updateTeacher, fetchTeachers} from '../../api/teacherService';
import {useNavigate, useParams} from 'react-router-dom';
import '../../styles/forms.css';
import '../../styles/buttons.css';

export default function TeacherForm() {
  const {id} = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  
  // Initialize the form state based on TeacherDTO structure
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    contactNumber: '',
    schoolId: ''
  });
  const [error, setError] = useState(null);
  
  // If editing, load the teacher details by filtering from the list (for simplicity)
  useEffect(() => {
    if (isEdit) {
      // Ideally, if you have a getTeacherById endpoint, use that.
      fetchTeachers().then((teachers) => {
        const teacher = teachers.find(t => t.id.toString() === id);
        if (teacher) {
          setForm({
            firstName: teacher.firstName || '',
            lastName: teacher.lastName || '',
            email: teacher.email || '',
            subject: teacher.subject || '',
            contactNumber: teacher.contactNumber || '',
            schoolId: teacher.schoolId || ''
          });
        } else {
          setError('Teacher not found');
        }
      });
    }
  }, [id, isEdit]);
  
  const handleChange = (e) => {
    const {name, value} = e.target;
    setForm(prev => ({...prev, [name]: value}));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateTeacher(id, form);
      } else {
        await createTeacher(form);
      }
      navigate('/teachers');
    } catch (err) {
      setError('Error saving teacher data ' + err);
    }
  };
  
  return (
    <div className="form-container">
      <h2>{isEdit ? 'Edit Teacher' : 'Add New Teacher'}</h2>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>First Name:</label>
          <input type="text" name="firstName" value={form.firstName} onChange={handleChange} required/>
        </div>
        <div className="form-group">
          <label>Last Name:</label>
          <input type="text" name="lastName" value={form.lastName} onChange={handleChange} required/>
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required/>
        </div>
        <div className="form-group">
          <label>Subject:</label>
          <input type="text" name="subject" value={form.subject} onChange={handleChange} required/>
        </div>
        <div className="form-group">
          <label>Contact Number:</label>
          <input type="text" name="contactNumber" value={form.contactNumber} onChange={handleChange} required/>
        </div>
        <div className="form-group">
          <label>School ID:</label>
          <input type="number" name="schoolId" value={form.schoolId} onChange={handleChange} required/>
        </div>
        <button type="submit" className="btn btn-success submit-btn">
          {isEdit ? 'Update Teacher' : 'Add Teacher'}
        </button>
      </form>
    </div>
  );
}