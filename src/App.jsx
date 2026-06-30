import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppShell from "@/components/layout/AppShell";
import ProtectedRoute from "@/routes/ProtectedRoute";
import Dashboard from "@/pages/dashboard/Dashboard";
import StudentsPage from "@/pages/students/StudentsPage.jsx";
import TeachersPage from "@/pages/teachers/TeachersPage";
import ClassesPage from "@/pages/classes/ClassesPage";
import TimetablePage from "@/pages/timetable/TimetablePage";
import AttendancePage from "@/pages/attendance/AttendancePage";
import FeesPage from "@/pages/fees/FeesPage";
import ExamsPage from "@/pages/exams/ExamsPage";
import LibraryPage from "@/pages/library/LibraryPage";
import FacilitiesPage from "@/pages/facilities/FacilitiesPage";
import HrPage from "@/pages/hr/HrPage";
import ParentsPage from "@/pages/parents/ParentsPage";
import NotificationsPage from "@/pages/notifications/NotificationsPage";
import ActivityLogsPage from "@/pages/activity-logs/ActivityLogsPage";
import LandingPage from "@/pages/landing/LandingPage.jsx";
import LoginPage from "@/pages/login/LoginPage.jsx";
import ForgotPasswordPage from "@/pages/forgot-password/ForgotPasswordPage";

export default function App () {
  return (
     <BrowserRouter>
       <Routes>
         {/* Public routes */}
         <Route path="/" element={<LandingPage/>}/>
         <Route path="/login" element={<LoginPage/>}/>
         <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>
         {/* Protected routes */}
         <Route element={<ProtectedRoute/>}>
           <Route element={<AppShell/>}>
             <Route path="dashboard" element={<Dashboard/>}/>
             <Route path="students/*" element={<StudentsPage/>}/>
             <Route path="teachers/*" element={<TeachersPage/>}/>
             <Route path="classes/*" element={<ClassesPage/>}/>
             <Route path="timetable/*" element={<TimetablePage/>}/>
             <Route path="attendance/*" element={<AttendancePage/>}/>
             <Route path="fees/*" element={<FeesPage/>}/>
             <Route path="exams/*" element={<ExamsPage/>}/>
             <Route path="library/*" element={<LibraryPage/>}/>
             <Route path="facilities/*" element={<FacilitiesPage/>}/>
             <Route path="hr/*" element={<HrPage/>}/>
             <Route path="parents/*" element={<ParentsPage/>}/>
             <Route path="notifications/*" element={<NotificationsPage/>}/>
             <Route path="activity-logs/*" element={<ActivityLogsPage/>}/>
           </Route>
         </Route>
         
         {/* Catch-all */}
         <Route path="*" element={<Navigate to="/" replace/>}/>
       </Routes>
     </BrowserRouter>
  );
}