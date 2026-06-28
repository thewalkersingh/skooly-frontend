import { useNavigate } from "react-router-dom";
import {
  School, Users, BookOpen, ClipboardList,
  CreditCard, BarChart3, ArrowRight, CheckCircle2,
  Mail, Phone, Github
} from "lucide-react";
import "./landing.css";

const FEATURES = [
  { icon: Users,         title: "Student Management",  desc: "Enroll, track, and manage every student's journey from admission to graduation." },
  { icon: Users,         title: "Teacher Management",  desc: "Manage staff profiles, subjects, and class assignments in one place." },
  { icon: ClipboardList, title: "Attendance Tracking", desc: "Bulk mark attendance by class and date. View history and summary reports instantly." },
  { icon: BookOpen,      title: "Library System",      desc: "Track book inventory, issue and return records with availability at a glance." },
  { icon: CreditCard,    title: "Fees & Finance",      desc: "Define fee structures, record payments, and monitor collection summaries." },
  { icon: BarChart3,     title: "Analytics Dashboard", desc: "Visual insights into school performance, attendance rates, and financials." },
];

const STEPS = [
  { n: "01", title: "Create your school",   desc: "Register your institution and set up classes, sections, and subjects." },
  { n: "02", title: "Add your people",      desc: "Onboard teachers, enroll students, and assign them to the right classes." },
  { n: "03", title: "Run your school",      desc: "Mark attendance, manage the library, collect fees — all from one dashboard." },
];

export default function LandingPage() {
  const navigate = useNavigate();
  
  return (
     <div className="lp-root">
       
       {/* ── NAV ── */}
       <nav className="lp-nav">
         <div className="lp-nav-inner">
           <div className="lp-brand">
             <div className="lp-brand-icon"><School size={20} /></div>
             <span className="lp-brand-name">Skooly</span>
           </div>
           <div className="lp-nav-links">
             <a href="#features">Features</a>
             <a href="#how">How it works</a>
             <a href="#contact">Contact</a>
           </div>
           <button className="lp-btn-outline" onClick={() => navigate("/login")}>
             Sign in
           </button>
         </div>
       </nav>
       
       {/* ── HERO ── */}
       <section className="lp-hero">
         <div className="lp-hero-orb" aria-hidden="true" />
         <div className="lp-hero-inner">
           <div className="lp-badge">School Management, Reimagined</div>
           <h1 className="lp-hero-title">
             Run your school<br />
             <span className="lp-hero-accent">without the chaos</span>
           </h1>
           <p className="lp-hero-sub">
             Skooly brings students, teachers, attendance, library, and finances
             under one roof — so you can focus on education, not paperwork.
           </p>
           <div className="lp-hero-actions">
             <button className="lp-btn-primary" onClick={() => navigate("/login")}>
               Get started <ArrowRight size={16} />
             </button>
             <a href="#features" className="lp-btn-ghost">See features</a>
           </div>
         </div>
       </section>
       
       {/* ── FEATURES ── */}
       <section className="lp-section" id="features">
         <div className="lp-section-inner">
           <p className="lp-section-eye">Everything you need</p>
           <h2 className="lp-section-title">One platform. Every corner of your school.</h2>
           <div className="lp-features-grid">
             {FEATURES.map(({ icon: Icon, title, desc }) => (
                <div className="lp-feature-card" key={title}>
                  <div className="lp-feature-icon"><Icon size={22} /></div>
                  <h3 className="lp-feature-title">{title}</h3>
                  <p className="lp-feature-desc">{desc}</p>
                </div>
             ))}
           </div>
         </div>
       </section>
       
       {/* ── HOW IT WORKS ── */}
       <section className="lp-section lp-section--alt" id="how">
         <div className="lp-section-inner">
           <p className="lp-section-eye">How it works</p>
           <h2 className="lp-section-title">Up and running in minutes</h2>
           <div className="lp-steps">
             {STEPS.map(({ n, title, desc }) => (
                <div className="lp-step" key={n}>
                  <div className="lp-step-num">{n}</div>
                  <h3 className="lp-step-title">{title}</h3>
                  <p className="lp-step-desc">{desc}</p>
                </div>
             ))}
           </div>
         </div>
       </section>
       
       {/* ── CTA BANNER ── */}
       <section className="lp-cta-banner">
         <div className="lp-cta-inner">
           <h2 className="lp-cta-title">Ready to modernise your school?</h2>
           <p className="lp-cta-sub">Join schools already saving hours every week with Skooly.</p>
           <button className="lp-btn-primary lp-btn-large" onClick={() => navigate("/login")}>
             Get started free <ArrowRight size={18} />
           </button>
         </div>
       </section>
       
       {/* ── CONTACT ── */}
       <section className="lp-section" id="contact">
         <div className="lp-section-inner lp-contact-grid">
           <div>
             <p className="lp-section-eye">Get in touch</p>
             <h2 className="lp-section-title" style={{ maxWidth: 320 }}>We're here to help</h2>
             <p style={{ color: "var(--lp-muted)", marginTop: 12, lineHeight: 1.7 }}>
               Have questions about Skooly? Reach out and our team will get back to you shortly.
             </p>
           </div>
           <div className="lp-contact-items">
             <div className="lp-contact-item">
               <Mail size={18} />
               <span>anysignup47@gmail.app</span>
             </div>
             <div className="lp-contact-item">
               <Phone size={18} />
               <span>+91 (9021977961) SKOOLY</span>
             </div>
             <div className="lp-contact-item">
               <Github size={18} />
               <span>github.com/skooly</span>
             </div>
           </div>
         </div>
       </section>
       
       {/* ── FOOTER ── */}
       <footer className="lp-footer">
         <div className="lp-footer-inner">
           <div className="lp-brand">
             <div className="lp-brand-icon"><School size={16} /></div>
             <span className="lp-brand-name">Skooly</span>
           </div>
           <p className="lp-footer-copy">© {new Date().getFullYear()} Skooly. All rights reserved.</p>
         </div>
       </footer>
     
     </div>
  );
}