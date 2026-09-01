import { Outlet, NavLink } from "react-router-dom";
import "./super-admin.css";
import { Link } from "react-router-dom";
import { ArrowLeft, School, UserCheck, Settings } from "lucide-react";

const NAV = [
  { label: "Schools", path: "/super-admin/schools", icon: School },
  { label: "Pending Accounts", path: "/super-admin/accounts", icon: UserCheck },
  { label: "Settings", path: "/super-admin/settings", icon: Settings },
];

export default function SuperAdminShell () {
  return (
     <div className="sa-shell">
       <aside className="sa-sidebar">
         <div className="sa-logo">
           <div className="sa-logo-icon"><School size={18}/></div>
           <span>Super Admin</span>
         </div>
         <Link to="/dashboard" className="sa-back-link">
           <ArrowLeft size={14}/> Back to Skooly
         </Link>
         <nav className="sa-nav">
           {NAV.map(({ label, path, icon: Icon }) => (
              <NavLink key={path}
                       to={path}
                       className={({ isActive }) => `sa-nav-item${isActive ? " active" : ""}`}>
                <Icon size={17}/>
                <span>{label}</span>
              </NavLink>
           ))}
         </nav>
       </aside>
       <main className="sa-content">
         <Outlet/>
       </main>
     </div>
  );
}