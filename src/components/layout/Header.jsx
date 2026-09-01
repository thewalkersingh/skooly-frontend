import { Bell, User, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useNavigate } from "react-router-dom";

export default function Header ({ title }) {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  
  const displayName = user?.firstName
     ? `${user.firstName} ${user.lastName ?? ""}`.trim()
     : "Admin";
  
  const roleLabel = user?.role?.replace("_", " ") ?? "ADMIN";
  
  return (
     <header className="header">
       <h1 className="header-title">{title}</h1>
       
       <div className="header-right">
         {/* School badge — shown if schoolId is resolved */}
         {user?.schoolId && (
            <span className="header-school-badge">
            School #{user.schoolId}
          </span>
         )}
         
         {/* Notifications */}
         <button className="header-icon-btn" title="Notifications">
           <Bell/>
           <span className="header-notif-dot"/>
         </button>
         
         {/* User info */}
         <div className="header-user">
           <div className="header-avatar">
             <User/>
           </div>
           <div className="header-user-info">
             <span className="header-user-name">{displayName}</span>
             <span className="header-user-role">{roleLabel}</span>
           </div>
         </div>
         
         {/* Logout */}
         <button
            className="header-icon-btn"
            title="Logout"
            onClick={handleLogout}
            style={{ marginLeft: 4 }}
         >
           <LogOut/>
         </button>
       </div>
     </header>
  );
}