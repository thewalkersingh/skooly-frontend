import React, {Suspense} from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import Home from "./pages/Home.jsx";
import MarkAttendance from "./components/Attendance/MarkAttendance.jsx";
import AttendanceList from "./components/Attendance/AttendanceList.jsx";
import AssignmentList from './components/Assignments/AssignmentList';
import AssignmentForm from './components/Assignments/AssignmentForm';
import SubmissionForm from './components/Submissions/SubmissionForm';
import GradeForm from './components/Grades/GradeForm';
import FeeDashboard from "./components/Fee/FeeDashboard.jsx";
import DashboardOverview from "./components/Admin/DashboardOverview.jsx";
import FeeManagement from "./components/Admin/FeeManagement.jsx";
import ManageStudents from "./components/Admin/ManageStudents.jsx";
import ManageTeachers from "./components/Admin/ManageTeachers.jsx";
import ManageSchools from "./components/Admin/ManageSchools.jsx";
import AdminDashboard from "./components/Admin/AdminDashboard.jsx";
import Footer from "./components/Navbar/Footer.jsx";
import About from "./pages/About.jsx";

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
  // Suppose you get studentId from user authentication state.
  const studentId = 1; // or use your actual logic to fetch the student's ID
  return (
    <Router>
      <Navbar/>
      <Suspense fallback={<div className="loading">Loading...</div>}>
        <Routes>
          
          <Route path="/" element={<Home/>}/>
          <Route path="/" element={<Navigate to="/" replace/>}/>
          <Route path="/about" element={<About/>}/>
          
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
          
          <Route path="/assignments" element={<AssignmentList/>}/>
          <Route path="/assignments/new" element={<AssignmentForm/>}/>
          <Route path="/submissions/new" element={<SubmissionForm/>}/>
          <Route path="/grades/new" element={<GradeForm/>}/>
          
          <Route path="/student/fees" element={<FeeDashboard studentId={studentId}/>}/>
          {/*<Route path="/admin" element={<Admin/>}/>*/}
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard/>}>
            <Route path="dashboard" element={<DashboardOverview/>}/>
            <Route path="fees" element={<FeeManagement/>}/>
            <Route path="students" element={<ManageStudents/>}/>
            <Route path="teachers" element={<ManageTeachers/>}/>
            <Route path="schools" element={<ManageSchools/>}/>
          </Route>
          
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<Signup/>}/>
          <Route path="/contact" element={<Contact/>}/>
        
        </Routes>
      </Suspense>
      <Footer/>
    </Router>
  );
}

export default App;