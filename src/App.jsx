import React, {Suspense} from 'react';
import {BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from "./pages/Home.jsx";
import MarkAttendance from "./components/Attendance/MarkAttendance.jsx";
import AttendanceList from "./components/Attendance/AttendanceList.jsx";

const SchoolList = React.lazy(() => import('./components/School/SchoolList'));
const SchoolForm = React.lazy(() => import('./components/School/SchoolForm'));
const StudentList = React.lazy(() => import('./components/Student/StudentList'));
const StudentForm = React.lazy(() => import('./components/Student/StudentForm'));
const TeacherList = React.lazy(() => import('./components/Teacher/TeacherList'));
const TeacherForm = React.lazy(() => import('./components/Teacher/TeacherForm'));
const CourseList = React.lazy(() => import('./components/Course/CourseList'));
const CourseForm = React.lazy(() => import('./components/Course/CourseForm'));
const Login = React.lazy(() => import('./components/Auth/Login'));
const Signup = React.lazy(() => import('./components/Auth/Signup'));
const Contact = React.lazy(() => import('./components/Contact/Contact'));

function App() {
  return (
    <Router>
      <Navbar/>
      <Suspense fallback={<div className="loading">Loading...</div>}>
        <Routes>
          
          <Route path="/" element={<Home/>}/>
          {/*<Route path="/" element={<Navigate to="/schools" replace/>}/>*/}
          <Route path="/schools" element={<SchoolList/>}/>
          <Route path="/schools/new" element={<SchoolForm/>}/>
          <Route path="/schools/:id/edit" element={<SchoolForm/>}/>
          <Route path="/students" element={<StudentList/>}/>
          <Route path="/students/new" element={<StudentForm/>}/>
          <Route path="/students/:id/edit" element={<StudentForm/>}/>
          <Route path="/teachers" element={<TeacherList/>}/>
          <Route path="/teachers/new" element={<TeacherForm/>}/>
          <Route path="/teachers/:id/edit" element={<TeacherForm/>}/>
          <Route path="/courses" element={<CourseList/>}/>
          <Route path="/courses/new" element={<CourseForm/>}/>
          <Route path="/courses/:id/edit" element={<CourseForm/>}/>
          <Route path="/attendance" element={<AttendanceList/>}/>
          <Route path="/attendance/new" element={<MarkAttendance/>}/>
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/contact" element={<Contact/>}/>
        
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;