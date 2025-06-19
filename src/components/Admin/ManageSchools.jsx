// ManageSchools.jsx
import React, {useEffect, useState} from 'react';
import axios from 'axios';

const ManageSchools = () => {
  const [schools, setSchools] = useState([]);
  
  useEffect(() => {
    axios
      .get('/api/admin/schools')
      .then((res) => setSchools(res.data))
      .catch((err) => console.error(err));
  }, []);
  
  return (
    <div>
      <h2>Manage Schools</h2>
      <table border="1" cellPadding="5">
        <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Address</th>
          <th>Email</th>
        </tr>
        </thead>
        <tbody>
        {schools.map((school) => (
          <tr key={school.id}>
            <td>{school.id}</td>
            <td>{school.name}</td>
            <td>{school.address}</td>
            <td>{school.email}</td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageSchools;