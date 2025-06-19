// ManageStudents.jsx
import React, {useEffect, useState} from 'react';
import axios from 'axios';

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  
  useEffect(() => {
    axios
      .get('/api/students/all')
      .then((res) => setStudents(res.data))
      .catch((err) => console.error(err));
  }, []);
  
  return (
    <div>
      <h2>Manage Students</h2>
      <table border="1" cellPadding="5">
        <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
        </tr>
        </thead>
        <tbody>
        {students.map((student) => (
          <tr key={student.id}>
            <td>{student.id}</td>
            <td>
              {student.firstName} {student.lastName}
            </td>
            <td>{student.email}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageStudents;