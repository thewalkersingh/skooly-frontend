import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { School, AlertCircle, Eye, EyeOff, ShieldCheck } from "lucide-react";
import authApi from "@/services/authApi";
import { useAuthStore } from "@/store/authStore";
import "./SetPasswordPage.css";

const STEPS = { OTP: 1, PASSWORD: 2 };

export default function SetPasswordPage () {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuthStore();
  
  const identifier = searchParams.get("identifier") ?? "";
  
  const [step, setStep] = useState(STEPS.OTP);
  const [otp, setOtp] = useState("");
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [showPwd, setShowPwd] = useState({ new: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState(null);
  
  // No identifier in URL — bounce back to login
  useEffect(() => {
    if (!identifier) navigate("/login", { replace: true });
  }, [identifier, navigate]);
  
  const clearError = () => setError(null);
  
  const handleResend = async () => {
    setResending(true);
    clearError();
    try {
      await authApi.resendOtp(identifier, "FIRST_LOGIN");
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setResending(false);
    }
  };
  
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }
    setLoading(true);
    clearError();
    try {
      await authApi.verifyOtp({ identifier, otp, purpose: "FIRST_LOGIN" });
      setStep(STEPS.PASSWORD);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleSetPassword = async (e) => {
    e.preventDefault();
    if (form.newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (form.newPassword !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    clearError();
    try {
      const res = await authApi.setPassword({
        identifier,
        otp,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword,
      });
      // Backend returns a full LoginResponse — log the user straight in
      await login(res.data.data);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  if (!identifier) return null;
  
  return (
     <div className="sp-root">
       <div className="sp-card">
         <div className="sp-brand">
           <div className="sp-brand-icon"><School size={20}/></div>
           <span className="sp-brand-name">Skooly</span>
         </div>
         
         <div className="sp-icon-wrap"><ShieldCheck size={28}/></div>
         <h1 className="sp-title">
           {step === STEPS.OTP ? "Verify it's you" : "Set your password"}
         </h1>
         <p className="sp-sub">
           {step === STEPS.OTP
              ? <>This is your first login. We've sent a verification code to <strong>{identifier}</strong>.</>
              : "Choose a password you'll use to sign in going forward."}
         </p>
         
         {error && (
            <div className="sp-error">
              <AlertCircle size={15}/>
              <span>{error}</span>
            </div>
         )}
         
         {step === STEPS.OTP && (
            <form className="sp-form" onSubmit={handleVerifyOtp}>
              <div className="sp-field">
                <label className="sp-label">One-time code</label>
                <input
                   className="sp-input sp-input--otp"
                   type="text"
                   inputMode="numeric"
                   maxLength={6}
                   placeholder="000000"
                   value={otp}
                   onChange={(e) => {
                     setOtp(e.target.value.replace(/\D/g, ""));
                     clearError();
                   }}
                   autoFocus
                />
              </div>
              <button className="sp-btn" type="submit" disabled={loading}>
                {loading ? <span className="sp-spinner"/> : "Verify"}
              </button>
              <button type="button" className="sp-link" onClick={handleResend} disabled={resending}>
                {resending ? "Resending…" : "Resend code"}
              </button>
            </form>
         )}
         
         {step === STEPS.PASSWORD && (
            <form className="sp-form" onSubmit={handleSetPassword}>
              <div className="sp-field">
                <label className="sp-label">New password</label>
                <div className="sp-input-wrap">
                  <input
                     className="sp-input"
                     type={showPwd.new ? "text" : "password"}
                     placeholder="Min. 8 characters"
                     value={form.newPassword}
                     onChange={(e) => {
                       setForm(f => ({ ...f, newPassword: e.target.value }));
                       clearError();
                     }}
                     autoFocus
                  />
                  <button type="button"
                          className="sp-eye"
                          onClick={() => setShowPwd(p => ({ ...p, new: !p.new }))}>
                    {showPwd.new ? <EyeOff size={15}/> : <Eye size={15}/>}
                  </button>
                </div>
              </div>
              <div className="sp-field">
                <label className="sp-label">Confirm password</label>
                <div className="sp-input-wrap">
                  <input
                     className="sp-input"
                     type={showPwd.confirm ? "text" : "password"}
                     placeholder="Repeat password"
                     value={form.confirmPassword}
                     onChange={(e) => {
                       setForm(f => ({ ...f, confirmPassword: e.target.value }));
                       clearError();
                     }}
                  />
                  <button type="button"
                          className="sp-eye"
                          onClick={() => setShowPwd(p => ({ ...p, confirm: !p.confirm }))}>
                    {showPwd.confirm ? <EyeOff size={15}/> : <Eye size={15}/>}
                  </button>
                </div>
              </div>
              <button className="sp-btn" type="submit" disabled={loading}>
                {loading ? <span className="sp-spinner"/> : "Set password & continue"}
              </button>
            </form>
         )}
       </div>
     </div>
  );
}