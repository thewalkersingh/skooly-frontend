import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { School, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import authApi from "@/services/authApi";
import "./login.css";

export default function LoginPage () {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  
  const [form, setForm] = useState({ username: "", password: "" });
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [oauthToast, setOauthToast] = useState(false);
  
  const showOauthToast = () => {
    setOauthToast(true);
    setTimeout(() => setOauthToast(false), 3000);
  };
  
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
      const res = await authApi.login({ identifier: form.username, password: form.password });
      await login(res.data.data);       // unwrap ApiResponse<T> → .data.data
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message ?? "Invalid username or password.");
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
           
           <div className="login-divider"><span>or continue with</span></div>
           <div className="login-oauth">
             <button className="login-oauth-btn" onClick={showOauthToast}>
               <img src="https://www.svgrepo.com/show/475656/google-color.svg"
                    width={18}
                    height={18}
                    alt="Google"/>
               Google
             </button>
             <button className="login-oauth-btn" onClick={showOauthToast}>
               <img src="https://www.svgrepo.com/show/452062/microsoft.svg"
                    width={18}
                    height={18}
                    alt="Microsoft"/>
               Microsoft
             </button>
           </div>
           {oauthToast && (
              <div className="login-toast">OAuth coming soon — stay tuned!</div>
           )}
           
           <p className="login-back">
             <a onClick={() => navigate("/forgot-password")} style={{ cursor: "pointer" }}>
               Forgot password?
             </a>
             {" · "}
             <a onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
               Back to home
             </a>
           </p>
         </div>
       </div>
     </div>
  );
}