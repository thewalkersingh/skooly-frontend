import React from 'react';
import {Link} from 'react-router-dom';
import '../../styles/Navbar.css';

export default function Navbar() {
  return (
    <nav className="navbar">
      {/* Left Side: Menu */}
      <div className="nav-left">
        <Link to="/students">Students</Link>
        <Link to="/teachers">Teachers</Link>
        <Link to="/courses">Courses</Link>
        <Link to="/sports">Sports</Link>
        <Link to="/facilities">Facilities</Link>
      </div>
      
      {/* Center: School Name */}
      <div className="nav-center">
        <Link to="/schools">Skooly</Link>
      </div>
      
      {/* Right Side: Authentication & Contact */}
      <div className="nav-right">
        <Link to="/login">Login</Link>
        <Link to="/signup">Signup</Link>
        <Link to="/contact">Contact</Link>
      </div>
    </nav>
  );
}