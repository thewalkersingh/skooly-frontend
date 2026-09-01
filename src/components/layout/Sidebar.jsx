import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard, Users, GraduationCap, BookOpen, CalendarDays,
  ClipboardCheck, DollarSign, Library, Building2, FileText,
  UserCog, Users2, Bell, Activity, ChevronLeft, School, ShieldCheck,
} from "lucide-react";

import { useAuthStore } from "@/store/authStore";

const NAV_ITEMS = [
  {
    label: "Dashboard", path: "/dashboard", icon: LayoutDashboard,
    roles: ["SUPER_ADMIN", "ADMIN", "TEACHER", "STUDENT", "PARENT"],
  },
  {
    label: "Super Admin", path: "/super-admin", icon: ShieldCheck,
    roles: ["SUPER_ADMIN", "ADMIN"],
  },
  {
    label: "Students", path: "/students", icon: GraduationCap,
    roles: ["ADMIN", "TEACHER"],
  },
  {
    label: "Teachers", path: "/teachers", icon: Users,
    roles: ["ADMIN"],
  },
  {
    label: "Classes", path: "/classes", icon: BookOpen,
    roles: ["ADMIN", "TEACHER"],
  },
  {
    label: "Timetable", path: "/timetable", icon: CalendarDays,
    roles: ["ADMIN", "TEACHER", "STUDENT"],
  },
  {
    label: "Attendance", path: "/attendance", icon: ClipboardCheck,
    roles: ["ADMIN", "TEACHER"],
  },
  {
    label: "Fees", path: "/fees", icon: DollarSign,
    roles: ["ADMIN", "PARENT", "STUDENT"],
  },
  {
    label: "Exams & Results", path: "/exams", icon: FileText,
    roles: ["ADMIN", "TEACHER", "STUDENT", "PARENT"],
  },
  {
    label: "Library", path: "/library", icon: Library,
    roles: ["ADMIN", "TEACHER", "STUDENT"],
  },
  {
    label: "Facilities", path: "/facilities", icon: Building2,
    roles: ["ADMIN"],
  },
  {
    label: "Staff / HR", path: "/hr", icon: UserCog,
    roles: ["ADMIN"],
  },
  {
    label: "Parents", path: "/parents", icon: Users2,
    roles: ["ADMIN"],
  },
  {
    label: "Notifications", path: "/notifications", icon: Bell,
    roles: ["SUPER_ADMIN", "ADMIN", "TEACHER", "STUDENT", "PARENT"],
  },
  {
    label: "Activity Logs", path: "/activity-logs", icon: Activity,
    roles: ["SUPER_ADMIN", "ADMIN"],
  },
];

export default function Sidebar () {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const user = useAuthStore((s) => s.user);
  const role = user?.role ?? "ADMIN";
  
  const visibleItems = NAV_ITEMS.filter((item) => item.roles.includes(role));
  
  const isActive = (path) => location.pathname.startsWith(path);
  
  return (
     <aside className={`sidebar${collapsed ? " collapsed" : ""}`}>
       {/* Logo */}
       <div className="sidebar-logo">
         <div className="sidebar-logo-icon"><School/></div>
         {!collapsed && <span className="sidebar-logo-text">Skooly</span>}
       </div>
       
       {/* Role badge */}
       {!collapsed && (
          <div className="sidebar-role-badge">{role.replace("_", " ")}</div>
       )}
       
       {/* Nav */}
       <nav className="sidebar-nav">
         {visibleItems.map(({ label, path, icon: Icon }, idx) => (
            <div key={path}>
              {label === "Super Admin" && <div className="sidebar-divider"/>}
              <NavLink
                 to={path}
                 title={collapsed ? label : undefined}
                 className={`sidebar-nav-item${isActive(path) ? " active" : ""}`}
              >
                <Icon/>
                <span className="sidebar-nav-label">{label}</span>
              </NavLink>
            </div>
         ))}
       </nav>
       
       {/* Collapse toggle */}
       <button
          className="sidebar-toggle"
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
       >
         <ChevronLeft/>
       </button>
       ;
     </aside>
  )
     ;
}