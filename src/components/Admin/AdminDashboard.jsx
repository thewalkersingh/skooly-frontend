// AdminDashboard.jsx
import React from 'react';
import {Outlet, NavLink} from 'react-router-dom';
import '../../styles/AdminDashboard.css'; // Create your own CSS

const AdminDashboard = () => {
  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="sidebar">
        <h2>Admin Panel</h2>
        <nav>
          <ul>
            <li>
              <NavLink to="dashboard" className={({isActive}) => isActive ? 'active' : ''}>
                Overview
              </NavLink>
            </li>
            <li>
              <NavLink to="fees" className={({isActive}) => isActive ? 'active' : ''}>
                Fee Management
              </NavLink>
            </li>
            <li>
              <NavLink to="students" className={({isActive}) => isActive ? 'active' : ''}>
                Manage Students
              </NavLink>
            </li>
            <li>
              <NavLink to="teachers" className={({isActive}) => isActive ? 'active' : ''}>
                Manage Teachers
              </NavLink>
            </li>
            <li>
              <NavLink to="schools" className={({isActive}) => isActive ? 'active' : ''}>
                Manage Schools
              </NavLink>
            </li>
          </ul>
        </nav>
      </aside>
      
      {/* Main content */}
      <main className="content">
        <Outlet/>
      </main>
    </div>
  );
};

export default AdminDashboard;