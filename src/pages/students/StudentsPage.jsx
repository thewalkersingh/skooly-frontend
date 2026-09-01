import {useState, useEffect, useCallback} from "react";
import {Plus, Search, Pencil, Trash2, GraduationCap} from "lucide-react";
import {studentApi} from "@/services/studentApi";
import {classroomApi} from "@/services/classroomApi";
import {sectionApi} from "@/services/sectionApi";
import {parentApi} from "@/services/parentApi";
import {useAuthStore} from "@/store/authStore";
import {useToast} from "@/hooks/useToast";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ToastContainer from "@/components/ui/ToastContainer";
import StudentFormModal from "@/pages/students/StudentFormModal.jsx";
import "./students.css";

const STATUS_BADGE = {
   ACTIVE: "badge badge-success",
   INACTIVE: "badge badge-gray",
   GRADUATED: "badge badge-info",
   TRANSFERRED: "badge badge-warning",
};

function getInitials(identity) {
   const f = identity?.firstName?.[0] ?? "";
   const l = identity?.lastName?.[0] ?? "";
   return (f + l).toUpperCase();
}

function getFullName(identity) {
   return [identity?.firstName, identity?.lastName].filter(Boolean).join(" ") || "—";
}

function unwrapPage(res) {
   if (!res) return [];
   if (Array.isArray(res)) return res;

   // Get the body
   const body = res.data || res;
   if (!body) return [];

   // The 'data' field from the API response
   const payload = body.data;
   if (!payload) return [];

   // If payload is an array, return it
   if (Array.isArray(payload)) return payload;

   // If payload is a paginated object with 'content'
   if (payload.content) return payload.content;

   // If payload has a nested 'data' property that is an array (YOUR CASE)
   if (payload.data && Array.isArray(payload.data)) return payload.data;

   return [];
}

export default function StudentsPage() {
   const {user} = useAuthStore();
   const schoolId = user?.schoolId;
   const {toasts, toast} = useToast();

   const [students, setStudents] = useState([]);
   const [loading, setLoading] = useState(true);
   const [saving, setSaving] = useState(false);
   const [search, setSearch] = useState("");
   const [formOpen, setFormOpen] = useState(false);
   const [editTarget, setEditTarget] = useState(null);
   const [deleteTarget, setDeleteTarget] = useState(null);
   const [deleting, setDeleting] = useState(false);
   const [classes, setClasses] = useState([]);
   const [sections, setSections] = useState([]);
   const [parents, setParents] = useState([]);

   // ── dropdown data ──────────────────────────────────────
   useEffect(() => {
      if (!schoolId) return;
      Promise.all([
         classroomApi.getBySchool(schoolId),
         sectionApi.getBySchool(schoolId),
         parentApi.getBySchool(schoolId),
      ]).then(([classRes, sectionRes, parentRes]) => {
         setClasses(unwrapPage(classRes));
         setSections(unwrapPage(sectionRes));
         setParents(unwrapPage(parentRes));
      }).catch((err) => toast({message: "Failed to load dropdowns: " + err.message, type: "error"}));
   }, [schoolId]);

   // ── fetch students ─────────────────────────────────────
   const fetchStudents = useCallback(async () => {
      if (!schoolId) return;
      setLoading(true);
      try {
         const res = await studentApi.getAll(); // or getBySchool(schoolId) if you keep that name
         console.log('API Response:', res); // Debug log
         const unwrapped = unwrapPage(res);
         console.log('Unwrapped Data:', unwrapped); // Debug log
         console.log('schoolId:', schoolId);
         setStudents(unwrapped);
      } catch (err) {
         console.error('Error fetching students:', err); // Debug log
         toast({message: err.message, type: "error"});
      } finally {
         setLoading(false);
      }
   }, [schoolId]);

   useEffect(() => {
      fetchStudents();
   }, [fetchStudents]);

   // ── client-side search filter ──────────────────────────
   const filtered = search.trim()
       ? students.filter((s) => {
          const name = getFullName(s.identity).toLowerCase();
          const email = s.identity?.email?.toLowerCase() ?? "";
          const q = search.toLowerCase();
          return name.includes(q) || email.includes(q);
       })
       : students;

   // ── handlers ───────────────────────────────────────────
   const handleAdd = () => {
      setEditTarget(null);
      setFormOpen(true);
   };
   const handleEdit = (s) => {
      setEditTarget(s);
      setFormOpen(true);
   };

   const handleSubmit = async (payload) => {
      setSaving(true);
      try {
         if (editTarget) {
            await studentApi.update(editTarget.id, payload);
            toast({message: "Student updated successfully"});
         } else {
            await studentApi.create(schoolId, payload);
            toast({message: "Student added successfully"});
         }
         setFormOpen(false);
         fetchStudents();
      } catch (err) {
         toast({message: err.message, type: "error"});
      } finally {
         setSaving(false);
      }
   };

   const handleDelete = async () => {
      setDeleting(true);
      try {
         await studentApi.delete(deleteTarget.id);
         toast({message: "Student deleted successfully"});
         setDeleteTarget(null);
         fetchStudents();
      } catch (err) {
         toast({message: err.message, type: "error"});
      } finally {
         setDeleting(false);
      }
   };

   return (
       <div>
          <div className="page-header-row">
             <div>
                <h2 style={{fontSize: "var(--font-size-2xl)", fontWeight: 700, color: "var(--gray-900)"}}>
                   Students
                </h2>
                <p style={{fontSize: "var(--font-size-sm)", color: "var(--gray-500)", marginTop: 4}}>
                   Manage student records, enrollment, and profiles.
                </p>
             </div>
             <button className="btn btn-primary" onClick={handleAdd}>
                <Plus/> Add Student
             </button>
          </div>

          <div className="toolbar">
             <div className="search-input-wrapper">
                <Search/>
                <input
                    className="search-input"
                    placeholder="Search by name or email..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
             </div>
             <span style={{fontSize: "var(--font-size-sm)", color: "var(--gray-500)", marginLeft: "auto"}}>
          {filtered.length} student{filtered.length !== 1 ? "s" : ""}
        </span>
          </div>

          <div className="card">
             <div className="table-wrapper">
                <table className="table">
                   <thead>
                   <tr>
                      <th>Student</th>
                      <th>Gender</th>
                      <th>Class / Section</th>
                      <th>Phone</th>
                      <th>Admission Date</th>
                      <th>Status</th>
                      <th style={{textAlign: "right"}}>Actions</th>
                   </tr>
                   </thead>
                   <tbody>
                   {loading ? (
                       <tr>
                          <td colSpan={7} style={{textAlign: "center", padding: 40}}>
                             <div className="spinner" style={{margin: "0 auto"}}/>
                          </td>
                       </tr>
                   ) : filtered.length === 0 ? (
                       <tr>
                          <td colSpan={7}>
                             <div className="empty-state">
                                <GraduationCap/>
                                <strong>No students found</strong>
                                <p>{search ? "Try a different search term." : "Add your first student to get started."}</p>
                             </div>
                          </td>
                       </tr>
                   ) : (
                       filtered.map((s) => (
                           <tr key={s.id}>
                              <td>
                                 <div className="student-name-cell">
                                    <div className="student-avatar">{getInitials(s.identity)}</div>
                                    <div>
                                       <div className="name">{getFullName(s.identity)}</div>
                                       <div className="username">@{s.identity?.username ?? "—"}</div>
                                    </div>
                                 </div>
                              </td>
                              <td>{s.identity?.gender ?? "—"}</td>
                              <td>
                                 {s.classroomName
                                     ? <span>{s.classroomName}{s.sectionName ? " — " + s.sectionName : ""}</span>
                                     : <span style={{color: "var(--gray-400)"}}>—</span>}
                              </td>
                              <td>{s.identity?.phone ?? "—"}</td>
                              <td>{s.admissionDate ?? "—"}</td>
                              <td>
                      <span className={STATUS_BADGE[s.studentStatus] || "badge badge-gray"}>
                        {s.studentStatus}
                      </span>
                              </td>
                              <td>
                                 <div style={{display: "flex", gap: 4, justifyContent: "flex-end"}}>
                                    <button className="btn btn-ghost btn-icon" title="Edit"
                                            onClick={() => handleEdit(s)}>
                                       <Pencil style={{width: 15, height: 15}}/>
                                    </button>
                                    <button
                                        className="btn btn-ghost btn-icon"
                                        title="Delete"
                                        style={{color: "var(--danger)"}}
                                        onClick={() => setDeleteTarget(s)}
                                    >
                                       <Trash2 style={{width: 15, height: 15}}/>
                                    </button>
                                 </div>
                              </td>
                           </tr>
                       ))
                   )}
                   </tbody>
                </table>
             </div>
          </div>

          <StudentFormModal
              open={formOpen}
              onClose={() => setFormOpen(false)}
              onSubmit={handleSubmit}
              initial={editTarget}
              classes={classes}
              sections={sections}
              parents={parents}
              loading={saving}
          />

          <ConfirmDialog
              open={!!deleteTarget}
              onClose={() => setDeleteTarget(null)}
              onConfirm={handleDelete}
              loading={deleting}
              title="Delete Student"
              message={`Are you sure you want to delete ${deleteTarget ? getFullName(deleteTarget.identity)
                  : "this student"}? This action cannot be undone.`}
          />

          <ToastContainer toasts={toasts}/>
       </div>
   );
}