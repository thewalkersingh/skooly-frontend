import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import AppShell from "@/components/layout/AppShell";
import ProtectedRoute from "@/routes/ProtectedRoute";
import Dashboard from "@/pages/dashboard/Dashboard";
import StudentsPage from "@/pages/students/StudentsPage.jsx";
import ClassesPage from "@/pages/classes/ClassesPage";
import TimetablePage from "@/pages/timetable/TimetablePage";
import FeesPage from "@/pages/fees/FeesPage";
import ExamsPage from "@/pages/exams/ExamsPage";
import LibraryPage from "@/pages/library/LibraryPage";
import FacilitiesPage from "@/pages/facilities/FacilitiesPage";
import HrPage from "@/pages/staff/HrPage";
import ParentsPage from "@/pages/parents/ParentsPage";
import NotificationsPage from "@/pages/notifications/NotificationsPage";
import ActivityLogsPage from "@/pages/activity-logs/ActivityLogsPage";
import LandingPage from "@/pages/landing/LandingPage.jsx";
import LoginPage from "@/pages/login/LoginPage.jsx";
import ForgotPasswordPage from "@/pages/forgot-password/ForgotPasswordPage";
import SuperAdminRoute from "@/routes/SuperAdminRoute.jsx";
import SuperAdminShell from "@/pages/super-admin/SuperAdminShell.jsx";
import SchoolsPage from "@/pages/super-admin/SchoolsPage.jsx";
import PendingAccountsPage from "@/pages/super-admin/PendingAccountsPage.jsx";
import SettingsPage from "@/pages/super-admin/SettingsPage.jsx";
import SetPasswordPage from "@/pages/set-password/SetPasswordPage.jsx";
import RegisterPage from "@/pages/register/RegisterPage..jsx";

export default function App() {
   return (
       <BrowserRouter>
          <Routes>
             {/* Public routes */}
             <Route path="/home" element={<LandingPage/>}/>
             <Route path="/login" element={<LoginPage/>}/>
             <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>
             <Route path="/set-password" element={<SetPasswordPage/>}/>
             <Route path="/register" element={<RegisterPage/>}/>

             {/* Protected routes */}
             <Route element={<ProtectedRoute/>}>
                {/* Default redirect for authenticated users */}
                <Route index element={<Navigate to="/dashboard" replace/>}/>
                {/* Super Admin routes */}
                <Route element={<SuperAdminRoute/>}>
                   <Route path="super-admin" element={<SuperAdminShell/>}>
                      <Route index element={<Navigate to="schools" replace/>}/>
                      <Route path="schools" element={<SchoolsPage/>}/>
                      <Route path="accounts" element={<PendingAccountsPage/>}/>
                      <Route path="settings" element={<SettingsPage/>}/>
                   </Route>
                </Route>
                {/* Main App routes */}
                <Route element={<AppShell/>}>
                   <Route path="dashboard" element={<Dashboard/>}/>
                   <Route path="students/*" element={<StudentsPage/>}/>
                   <Route path="classes/*" element={<ClassesPage/>}/>
                   <Route path="timetable/*" element={<TimetablePage/>}/>
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