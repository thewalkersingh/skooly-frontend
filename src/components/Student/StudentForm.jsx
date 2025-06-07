import React, {useEffect, useState} from 'react';
import {createStudent, updateStudent, fetchStudents} from '../../api/studentService';
import {useNavigate, useParams} from 'react-router-dom';
import '../../styles/forms.css';
import '../../styles/buttons.css';

export default function StudentForm() {
  const {id} = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  
  // Define the fields reflecting your StudentDTO structure
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    address: '',
    contactNumber: '',
    email: '',
    parentsName: '',
    grade: '',
    age: '',
    schoolId: ''
  });
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (isEdit) {
      // Ideally, you would have a dedicated endpoint to fetch a student by id.
      // For simplicity, we are reusing fetchStudents and filtering.
      fetchStudents().then((students) => {
        const student = students.find(s => s.id.toString() === id);
        if (student) {
          setForm({
            firstName: student.firstName || '',
            lastName: student.lastName || '',
            address: student.address || '',
            contactNumber: student.contactNumber || '',
            email: student.email || '',
            parentsName: student.parentsName || '',
            grade: student.grade || '',
            age: student.age || '',
            schoolId: student.schoolId || ''
          });
        } else {
          setError('Student not found');
        }
      });
    }
  }, [id, isEdit]);
  
  const handleChange = e => {
    const {name, value} = e.target;
    setForm(prev => ({...prev, [name]: value}));
  };
  
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (isEdit) {
        await updateStudent(id, form);
      } else {
        await createStudent(form);
      }
      navigate('/students');
    } catch (err) {
      setError('Error saving student data: ' + err);
    }
  };
  
  return (
    <div className="form-container">
      <h2>{isEdit ? 'Edit Student' : 'Add New Student'}</h2>
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
          <label>Address:</label>
          <input type="text" name="address" value={form.address} onChange={handleChange}/>
        </div>
        <div className="form-group">
          <label>Contact Number:</label>
          <input type="text" name="contactNumber" value={form.contactNumber} onChange={handleChange} required/>
        </div>
        <div className="form-group">
          <label>Email:</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required/>
        </div>
        <div className="form-group">
          <label>Parents' Name:</label>
          <input type="text" name="parentsName" value={form.parentsName} onChange={handleChange} required/>
        </div>
        <div className="form-group">
          <label>Grade:</label>
          <input type="text" name="grade" value={form.grade} onChange={handleChange} required/>
        </div>
        <div className="form-group">
          <label>Age:</label>
          <input type="number" name="age" value={form.age} onChange={handleChange} required/>
        </div>
        <div className="form-group">
          <label>School ID:</label>
          <input type="number" name="schoolId" value={form.schoolId} onChange={handleChange} required/>
        </div>
        <button type="submit" className="btn btn-success submit-btn">
          {isEdit ? 'Update Student' : 'Add Student'}
        </button>
      </form>
    </div>
  );
}