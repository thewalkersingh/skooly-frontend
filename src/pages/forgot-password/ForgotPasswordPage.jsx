import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { School, AlertCircle, CheckCircle2, ArrowLeft, Eye, EyeOff } from "lucide-react";
import authApi from "@/services/authApi";
import "./ForgotPasswordPage.css";

const STEPS = { IDENTIFIER: 1, OTP: 2, PASSWORD: 3, DONE: 4 };

export default function ForgotPasswordPage () {
  const navigate = useNavigate();
  
  const [step, setStep] = useState(STEPS.IDENTIFIER);
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [showPwd, setShowPwd] = useState({ new: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const clearError = () => setError(null);
  
  // ── Step 1: Send OTP ──
  const handleSendOtp = async () => {
    if (!identifier.trim()) {
      setError("Please enter your email or phone.");
      return;
    }
    setLoading(true);
    clearError();
    try {
      await authApi.forgotPassword(identifier.trim());
      setStep(STEPS.OTP);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // ── Step 2: Verify OTP ──
  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }
    setLoading(true);
    clearError();
    try {
      await authApi.verifyOtp({
        identifier: identifier.trim(),
        otp,
        purpose: "PASSWORD_RESET",
      });
      setStep(STEPS.PASSWORD);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // ── Step 3: Reset password ──
  const handleResetPassword = async () => {
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
      await authApi.resetPassword({
        identifier: identifier.trim(),
        otp,
        newPassword: form.newPassword,
        confirmPassword: form.confirmPassword,
      });
      setStep(STEPS.DONE);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const stepLabel = { 1: "Find your account", 2: "Enter OTP", 3: "Set new password", 4: "All done" };
  
  return (
     <div className="fp-root">
       {/* Left panel */}
       <div className="fp-left">
         <div className="fp-left-orb" aria-hidden="true"/>
         <div className="fp-left-content">
           <div className="fp-brand">
             <div className="fp-brand-icon"><School size={20}/></div>
             <span className="fp-brand-name">Skooly</span>
           </div>
           <h2 className="fp-left-title">Account recovery made simple.</h2>
           <div className="fp-stepper">
             {[1, 2, 3].map((s) => (
                <div key={s}
                     className={`fp-step-item ${step >= s ? "fp-step-item--done" : ""} ${step === s
                        ? "fp-step-item--active" : ""}`}>
                  <div className="fp-step-circle">{step > s ? <CheckCircle2 size={14}/> : s}</div>
                  <span className="fp-step-label">
                  {s === 1 ? "Identify" : s === 2 ? "Verify OTP" : "Reset"}
                </span>
                </div>
             ))}
           </div>
         </div>
       </div>
       
       {/* Right panel */}
       <div className="fp-right">
         <div className="fp-card">
           
           {/* Back button */}
           {step !== STEPS.DONE && (
              <button className="fp-back"
                      onClick={() => step === STEPS.IDENTIFIER ? navigate("/login") : setStep(s => s - 1)}>
                <ArrowLeft size={15}/> {step === STEPS.IDENTIFIER ? "Back to login" : "Back"}
              </button>
           )}
           
           <h1 className="fp-title">{stepLabel[step]}</h1>
           
           {/* Error */}
           {error && (
              <div className="fp-error">
                <AlertCircle size={15}/>
                <span>{error}</span>
              </div>
           )}
           
           {/* ── STEP 1 ── */}
           {step === STEPS.IDENTIFIER && (
              <div className="fp-form">
                <p className="fp-sub">Enter the email or phone number linked to your account and we'll send you a
                                      one-time code.</p>
                <div className="fp-field">
                  <label className="fp-label">Email or Phone</label>
                  <input
                     className="fp-input"
                     type="text"
                     placeholder="e.g. admin@school.com or +1234567890"
                     value={identifier}
                     onChange={(e) => {
                       setIdentifier(e.target.value);
                       clearError();
                     }}
                     autoFocus
                  />
                </div>
                <button className="fp-btn" onClick={handleSendOtp} disabled={loading}>
                  {loading ? <span className="fp-spinner"/> : "Send OTP"}
                </button>
              </div>
           )}
           
           {/* ── STEP 2 ── */}
           {step === STEPS.OTP && (
              <div className="fp-form">
                <p className="fp-sub">
                  We sent a 6-digit code to <strong>{identifier}</strong>. Enter it below.
                </p>
                <div className="fp-field">
                  <label className="fp-label">One-time code</label>
                  <input
                     className="fp-input fp-input--otp"
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
                <button className="fp-btn" onClick={handleVerifyOtp} disabled={loading}>
                  {loading ? <span className="fp-spinner"/> : "Verify OTP"}
                </button>
                <button className="fp-link" onClick={handleSendOtp} disabled={loading}>
                  Resend code
                </button>
              </div>
           )}
           
           {/* ── STEP 3 ── */}
           {step === STEPS.PASSWORD && (
              <div className="fp-form">
                <p className="fp-sub">Choose a strong password — at least 8 characters.</p>
                <div className="fp-field">
                  <label className="fp-label">New password</label>
                  <div className="fp-input-wrap">
                    <input
                       className="fp-input"
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
                            className="fp-eye"
                            onClick={() => setShowPwd(p => ({ ...p, new: !p.new }))}>
                      {showPwd.new ? <EyeOff size={15}/> : <Eye size={15}/>}
                    </button>
                  </div>
                </div>
                <div className="fp-field">
                  <label className="fp-label">Confirm password</label>
                  <div className="fp-input-wrap">
                    <input
                       className="fp-input"
                       type={showPwd.confirm ? "text" : "password"}
                       placeholder="Repeat password"
                       value={form.confirmPassword}
                       onChange={(e) => {
                         setForm(f => ({ ...f, confirmPassword: e.target.value }));
                         clearError();
                       }}
                    />
                    <button type="button"
                            className="fp-eye"
                            onClick={() => setShowPwd(p => ({ ...p, confirm: !p.confirm }))}>
                      {showPwd.confirm ? <EyeOff size={15}/> : <Eye size={15}/>}
                    </button>
                  </div>
                </div>
                <button className="fp-btn" onClick={handleResetPassword} disabled={loading}>
                  {loading ? <span className="fp-spinner"/> : "Reset password"}
                </button>
              </div>
           )}
           
           {/* ── STEP 4: DONE ── */}
           {step === STEPS.DONE && (
              <div className="fp-done">
                <div className="fp-done-icon"><CheckCircle2 size={40}/></div>
                <h2 className="fp-done-title">Password reset!</h2>
                <p className="fp-done-sub">Your password has been updated. You can now sign in with your new
                                           credentials.</p>
                <button className="fp-btn" onClick={() => navigate("/login")}>
                  Go to login
                </button>
              </div>
           )}
         
         </div>
       </div>
     </div>
  );
}