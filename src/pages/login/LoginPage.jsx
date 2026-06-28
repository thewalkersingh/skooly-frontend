import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { School, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import "./login.css";

export default function LoginPage () {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const handleChange = (e) =>
     setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      setError("Please enter your username and password.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // TODO: Replace with real JWT auth call
      // const res = await authApi.login(form);
      // await login(res.data);
      await login({
        id: 1,
        username: form.username,
        role: "ADMIN",
        schoolId: 1,
        schoolName: "Demo School",
        token: "mock-jwt-token",
      });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message ?? "Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };
  
  return (
     <div className="login-root">
       {/* Left panel */}
       <div className="login-left">
         <div className="login-left-orb" aria-hidden="true"/>
         <div className="login-left-content">
           <div className="lp-brand" style={{ marginBottom: 48 }}>
             <div className="lp-brand-icon"><School size={20}/></div>
             <span className="lp-brand-name">Skooly</span>
           </div>
           <h2 className="login-left-title">The smarter way to run your school.</h2>
           <ul className="login-perks">
             {[
               "Students, teachers & classes in one place",
               "Attendance, library & fee management",
               "Real-time analytics dashboard",
             ].map((p) => (
                <li key={p} className="login-perk">
                  <span className="login-perk-dot"/>
                  {p}
                </li>
             ))}
           </ul>
         </div>
       </div>
       
       {/* Right panel — form */}
       <div className="login-right">
         <div className="login-card">
           <h1 className="login-title">Welcome back</h1>
           <p className="login-sub">Sign in to your Skooly account</p>
           
           {error && (
              <div className="login-error">
                <AlertCircle size={16}/>
                <span>{error}</span>
              </div>
           )}
           
           <div className="login-form">
             <div className="login-field">
               <label className="login-label" htmlFor="username">Username</label>
               <input
                  id="username"
                  name="username"
                  type="text"
                  className="login-input"
                  placeholder="Enter your username"
                  value={form.username}
                  onChange={handleChange}
                  autoComplete="username"
                  autoFocus
               />
             </div>
             
             <div className="login-field">
               <label className="login-label" htmlFor="password">Password</label>
               <div className="login-input-wrap">
                 <input
                    id="password"
                    name="password"
                    type={showPwd ? "text" : "password"}
                    className="login-input"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="current-password"
                 />
                 <button
                    type="button"
                    className="login-eye"
                    onClick={() => setShowPwd((v) => !v)}
                    aria-label={showPwd ? "Hide password" : "Show password"}
                 >
                   {showPwd ? <EyeOff size={16}/> : <Eye size={16}/>}
                 </button>
               </div>
             </div>
             
             <button
                className="login-submit"
                onClick={handleSubmit}
                disabled={loading}
             >
               {loading ? <span className="login-spinner"/> : "Sign in"}
             </button>
           </div>
           
           <p className="login-back">
             <a href="/" onClick={(e) => {
               e.preventDefault();
               navigate("/");
             }}>
               ← Back to home
             </a>
           </p>
         </div>
       </div>
     </div>
  );
}