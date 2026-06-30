import { useEffect, useState } from "react";
import {
  GraduationCap, Users, BookOpen, DollarSign,
  ClipboardCheck, FileText, Clock, AlertCircle
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import dashboardApi from "@/services/dashboardApi";
import "./dashboard.css";

const DUMMY_ACTIVITY = [
  { id: 1, text: "New student John Doe enrolled in Class 10A", time: "2 mins ago", type: "student" },
  { id: 2, text: "Teacher Sarah Khan marked attendance for 9B", time: "18 mins ago", type: "attendance" },
  { id: 3, text: "Fee payment received from James Osei — ₹4,500", time: "1 hr ago", type: "fee" },
  { id: 4, text: "Library book 'Physics Vol. 2' issued to Amy Li", time: "3 hrs ago", type: "library" },
  { id: 5, text: "Admin updated timetable for Class 8C", time: "Yesterday", type: "admin" },
];

const DUMMY_EXAMS = [
  { id: 1, subject: "Mathematics", class: "Class 10A", date: "Jul 5, 2026", type: "Mid-term" },
  { id: 2, subject: "English Literature", class: "Class 9B", date: "Jul 8, 2026", type: "Unit Test" },
  { id: 3, subject: "Physics", class: "Class 11A", date: "Jul 12, 2026", type: "Mid-term" },
  { id: 4, subject: "History", class: "Class 8C", date: "Jul 15, 2026", type: "Unit Test" },
];

const ACTIVITY_COLORS = {
  student: "blue",
  attendance: "green",
  fee: "amber",
  library: "purple",
  admin: "indigo",
};

export default function Dashboard () {
  const user = useAuthStore((s) => s.user);
  const schoolId = user?.schoolId;
  
  const [stats, setStats] = useState({ students: null, teachers: null, classes: null });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!schoolId) return;
    
    const fetchStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const [studentsRes, teachersRes, classesRes] = await Promise.allSettled([
          dashboardApi.getStudentCount(schoolId),
          dashboardApi.getTeacherCount(schoolId),
          dashboardApi.getClassCount(schoolId),
        ]);
        
        // Extract totalElements from PageResponse — works for both page object and plain array
        const extract = (res) => {
          if (res.status !== "fulfilled") return "—";
          const d = res.value.data?.data;
          if (!d) return "—";
          if (typeof d.totalElements === "number") return d.totalElements;
          if (Array.isArray(d)) return d.length;
          return "—";
        };
        
        setStats({
          students: extract(studentsRes),
          teachers: extract(teachersRes),
          classes: extract(classesRes),
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStats();
  }, [schoolId]);
  
  const STATS = [
    { label: "Total Students", value: loading ? "…" : stats.students, icon: GraduationCap, color: "blue" },
    { label: "Total Teachers", value: loading ? "…" : stats.teachers, icon: Users, color: "green" },
    { label: "Classes", value: loading ? "…" : stats.classes, icon: BookOpen, color: "purple" },
    { label: "Fee Collected", value: "—", icon: DollarSign, color: "amber" },
    { label: "Attendance Today", value: "—", icon: ClipboardCheck, color: "rose" },
    { label: "Exams This Month", value: DUMMY_EXAMS.length, icon: FileText, color: "indigo" },
  ];
  
  const firstName = user?.firstName ?? "Admin";
  
  return (
     <div>
       <div className="page-header">
         <h2>Welcome back, {firstName} 👋</h2>
         <p>Here's what's happening at your school today.</p>
       </div>
       
       {error && (
          <div className="dashboard-error">
            <AlertCircle size={15}/>
            <span>Could not load some stats: {error}</span>
          </div>
       )}
       
       {/* ── STAT CARDS ── */}
       <div className="stat-grid">
         {STATS.map(({ label, value, icon: Icon, color }) => (
            <div key={label} className="stat-card">
              <div className={`stat-card-icon ${color}`}>
                <Icon/>
              </div>
              <div>
                <div className="stat-card-label">{label}</div>
                <div className="stat-card-value">{value}</div>
              </div>
            </div>
         ))}
       </div>
       
       {/* ── BOTTOM CARDS ── */}
       <div className="dashboard-bottom">
         
         {/* Recent Activity */}
         <div className="card">
           <div className="card-header">
             <h3>Recent Activity</h3>
           </div>
           <div className="card-body">
             <ul className="activity-list">
               {DUMMY_ACTIVITY.map((item) => (
                  <li key={item.id} className="activity-item">
                    <span className={`activity-dot ${ACTIVITY_COLORS[item.type]}`}/>
                    <div className="activity-content">
                      <p className="activity-text">{item.text}</p>
                      <span className="activity-time">
                      <Clock size={11}/> {item.time}
                    </span>
                    </div>
                  </li>
               ))}
             </ul>
           </div>
         </div>
         
         {/* Upcoming Exams */}
         <div className="card">
           <div className="card-header">
             <h3>Upcoming Exams</h3>
           </div>
           <div className="card-body">
             <ul className="exam-list">
               {DUMMY_EXAMS.map((exam) => (
                  <li key={exam.id} className="exam-item">
                    <div className="exam-badge indigo">{exam.type}</div>
                    <div className="exam-info">
                      <p className="exam-subject">{exam.subject}</p>
                      <p className="exam-meta">{exam.class} · {exam.date}</p>
                    </div>
                  </li>
               ))}
             </ul>
           </div>
         </div>
       
       </div>
     </div>
  );
}