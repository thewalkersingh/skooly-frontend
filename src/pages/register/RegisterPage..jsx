import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { School, AlertCircle, CheckCircle2, ChevronDown } from "lucide-react";
import authApi from "@/services/authApi";
import { schoolApi } from "@/services/schoolApi";
import "./register.css";

const ROLES = ["TEACHER", "STUDENT", "PARENT", "STAFF"];
const GENDERS = ["MALE", "FEMALE", "OTHER"];

const EMPTY = {
  firstName: "", lastName: "", phone: "", email: "",
  gender: "", role: "", schoolId: "",
};

export default function RegisterPage () {
  const navigate = useNavigate();
  
  const [form, setForm] = useState(EMPTY);
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);
  
  // ── fetch public schools ───────────────────────────────
  useEffect(() => {
    schoolApi.getPublic()
       .then((res) => {
         const d = res.data?.data;
         setSchools(d?.data ?? d?.content ?? []);
       })
       .catch(() => setError("Could not load schools. Please try again later."))
       .finally(() => setFetching(false));
  }, []);
  
  const set = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    setError(null);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.phone || !form.gender || !form.role || !form.schoolId) {
      setError("Please fill in all required fields.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await authApi.register({
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        email: form.email || null,
        gender: form.gender,
        role: form.role,
        schoolId: Number(form.schoolId),
      });
      setDone(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
     <div className="reg-root">
       {/* Left panel */}
       <div className="reg-left">
         <div className="reg-left-orb" aria-hidden="true"/>
         <div className="reg-left-content">
           <div className="reg-brand">
             <div className="reg-brand-icon"><School size={20}/></div>
             <span className="reg-brand-name">Skooly</span>
           </div>
           <h2 className="reg-left-title">Join your school on Skooly.</h2>
           <ul className="reg-perks">
             {[
               "Request access to your school's portal",
               "Admin reviews and approves your account",
               "Log in and get started right away",
             ].map((p) => (
                <li key={p} className="reg-perk">
                  <span className="reg-perk-dot"/>
                  {p}
                </li>
             ))}
           </ul>
         </div>
       </div>
       
       {/* Right panel */}
       <div className="reg-right">
         <div className="reg-card">
           
           {done ? (
              /* ── SUCCESS STATE ── */
              <div className="reg-done">
                <div className="reg-done-icon"><CheckCircle2 size={44}/></div>
                <h2 className="reg-done-title">Request submitted!</h2>
                <p className="reg-done-sub">
                  Your registration request has been sent to your school admin for approval.
                  Once approved, you'll receive your login credentials via email or SMS.
                </p>
                <button className="reg-btn" onClick={() => navigate("/login")}>
                  Go to login
                </button>
              </div>
           ) : (
              <>
                <h1 className="reg-title">Create an account</h1>
                <p className="reg-sub">Fill in your details and your school admin will approve your request.</p>
                
                {error && (
                   <div className="reg-error">
                     <AlertCircle size={15}/>
                     <span>{error}</span>
                   </div>
                )}
                
                <form className="reg-form" onSubmit={handleSubmit}>
                  
                  <div className="reg-form-grid">
                    <div className="reg-field">
                      <label className="reg-label">First Name <span className="reg-required">*</span></label>
                      <input className="reg-input"
                             value={form.firstName}
                             onChange={set("firstName")}
                             placeholder="John"
                             autoFocus/>
                    </div>
                    <div className="reg-field">
                      <label className="reg-label">Last Name <span className="reg-required">*</span></label>
                      <input className="reg-input"
                             value={form.lastName}
                             onChange={set("lastName")}
                             placeholder="Doe"/>
                    </div>
                  </div>
                  
                  <div className="reg-form-grid">
                    <div className="reg-field">
                      <label className="reg-label">Phone <span className="reg-required">*</span></label>
                      <input className="reg-input"
                             value={form.phone}
                             onChange={set("phone")}
                             placeholder="+1234567890"/>
                    </div>
                    <div className="reg-field">
                      <label className="reg-label">Email <span className="reg-label-opt">(optional)</span></label>
                      <input className="reg-input"
                             type="email"
                             value={form.email}
                             onChange={set("email")}
                             placeholder="john@example.com"/>
                    </div>
                  </div>
                  
                  <div className="reg-form-grid">
                    <div className="reg-field">
                      <label className="reg-label">Gender <span className="reg-required">*</span></label>
                      <div className="reg-select-wrap">
                        <select className="reg-select" value={form.gender} onChange={set("gender")}>
                          <option value="">— Select —</option>
                          {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
                        </select>
                        <ChevronDown size={14} className="reg-select-icon"/>
                      </div>
                    </div>
                    <div className="reg-field">
                      <label className="reg-label">Role <span className="reg-required">*</span></label>
                      <div className="reg-select-wrap">
                        <select className="reg-select" value={form.role} onChange={set("role")}>
                          <option value="">— Select —</option>
                          {ROLES.map((r) => <option key={r} value={r}>{r}</option>)}
                        </select>
                        <ChevronDown size={14} className="reg-select-icon"/>
                      </div>
                    </div>
                  </div>
                  
                  <div className="reg-field">
                    <label className="reg-label">School <span className="reg-required">*</span></label>
                    <div className="reg-select-wrap">
                      <select
                         className="reg-select"
                         value={form.schoolId}
                         onChange={set("schoolId")}
                         disabled={fetching}
                      >
                        <option value="">
                          {fetching ? "Loading schools…" : "— Select your school —"}
                        </option>
                        {schools.map((s) => (
                           <option key={s.id} value={s.id}>{s.schoolName}</option>
                        ))}
                      </select>
                      <ChevronDown size={14} className="reg-select-icon"/>
                    </div>
                  </div>
                  
                  <button className="reg-btn" type="submit" disabled={loading || fetching}>
                    {loading ? <span className="reg-spinner"/> : "Submit request"}
                  </button>
                
                </form>
                
                <p className="reg-back">
                  Already have an account?{" "}
                  <a onClick={() => navigate("/login")} style={{ cursor: "pointer" }}>
                    Sign in
                  </a>
                </p>
              </>
           )}
         
         </div>
       </div>
     </div>
  );
}