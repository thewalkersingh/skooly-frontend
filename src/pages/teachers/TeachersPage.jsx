import { useState, useEffect, useCallback } from "react";
import { Plus, Search, Pencil, Trash2, Users } from "lucide-react";
import { teacherApi } from "@/services/teacherApi";
import { subjectApi } from "@/services/subjectApi";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/hooks/useToast";
import TeacherFormModal from "./TeacherFormModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";
import ToastContainer from "@/components/ui/ToastContainer";
import "./teachers.css";
import { accountApi } from "@/services/accountApi";

const STATUS_BADGE = {
  ACTIVE: "badge badge-success",
  INACTIVE: "badge badge-gray",
  LEFT: "badge badge-gray",
  TRANSFERRED: "badge badge-warning",
  RETIRED: "badge badge-info",
  DELETED: "badge badge-danger",
};

function getInitials (identity) {
  return ((identity?.firstName?.[0] ?? "") + (identity?.lastName?.[0] ?? "")).toUpperCase();
}

function getFullName (identity) {
  return [identity?.firstName, identity?.lastName].filter(Boolean).join(" ") || "—";
}

function unwrapPage (res) {
  const d = res.data?.data;
  if (!d) return [];
  if (Array.isArray(d)) return d;
  return d.data ?? d.content ?? [];
}

export default function TeachersPage () {
  const { user } = useAuthStore();
  const schoolId = user?.schoolId;
  const { toasts, toast } = useToast();
  const [creatingAccount, setCreatingAccount] = useState(null); // teacher being acted on
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  
  // ── subjects dropdown ──────────────────────────────────
  useEffect(() => {
    if (!schoolId) return;
    subjectApi.getBySchool(schoolId)
       .then((res) => setSubjects(unwrapPage(res)))
       .catch((err) => toast({ message: "Failed to load subjects: " + err.message, type: "error" }));
  }, [schoolId]);
  
  // ── fetch teachers ─────────────────────────────────────
  const fetchTeachers = useCallback(async (q) => {
    if (!schoolId) return;
    setLoading(true);
    try {
      const res = q?.trim()
         ? await teacherApi.searchByName(schoolId, q.trim())
         : await teacherApi.getBySchool(schoolId);
      setTeachers(unwrapPage(res));
    } catch (err) {
      toast({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  }, [schoolId]);
  
  useEffect(() => { fetchTeachers(); }, [fetchTeachers]);
  
  useEffect(() => {
    const t = setTimeout(() => fetchTeachers(search), 300);
    return () => clearTimeout(t);
  }, [search, fetchTeachers]);
  
  const handleAdd = () => {
    setEditTarget(null);
    setFormOpen(true);
  };
  const handleEdit = (t) => {
    setEditTarget(t);
    setFormOpen(true);
  };
  
  const handleSubmit = async (payload) => {
    setSaving(true);
    try {
      if (editTarget) {
        await teacherApi.update(editTarget.id, payload);
        toast({ message: "Teacher updated successfully" });
      } else {
        await teacherApi.create(payload);
        toast({ message: "Teacher added successfully" });
      }
      setFormOpen(false);
      fetchTeachers(search);
    } catch (err) {
      toast({ message: err.message, type: "error" });
    } finally {
      setSaving(false);
    }
  };
  
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await teacherApi.delete(deleteTarget.id);
      toast({ message: "Teacher deleted successfully" });
      setDeleteTarget(null);
      fetchTeachers(search);
    } catch (err) {
      toast({ message: err.message, type: "error" });
    } finally {
      setDeleting(false);
    }
  };
  const handleCreateAccount = async (teacher) => {
    setCreatingAccount(teacher.id);
    try {
      await accountApi.createAccount({
        firstName: teacher.identity?.firstName,
        lastName: teacher.identity?.lastName,
        phone: teacher.identity?.phone,
        email: teacher.identity?.email ?? null,
        gender: teacher.identity?.gender,
        role: "TEACHER",
        schoolId: schoolId,
        roleEntityId: teacher.id,
      });
      toast({ message: `Account created for ${getFullName(teacher.identity)} — pending approval.` });
    } catch (err) {
      toast({ message: err.message, type: "error" });
    } finally {
      setCreatingAccount(null);
    }
  };
  return (
     <div>
       <div className="page-header-row">
         <div>
           <h2 style={{ fontSize: "var(--font-size-2xl)", fontWeight: 700, color: "var(--gray-900)" }}>
             Teachers
           </h2>
           <p style={{ fontSize: "var(--font-size-sm)", color: "var(--gray-500)", marginTop: 4 }}>
             Manage teacher profiles, subjects, and assignments.
           </p>
         </div>
         <button className="btn btn-primary" onClick={handleAdd}>
           <Plus/> Add Teacher
         </button>
       </div>
       
       <div className="toolbar">
         <div className="search-input-wrapper">
           <Search/>
           <input
              className="search-input"
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
           />
         </div>
         <span style={{ fontSize: "var(--font-size-sm)", color: "var(--gray-500)", marginLeft: "auto" }}>
          {teachers.length} teacher{teachers.length !== 1 ? "s" : ""}
        </span>
       </div>
       
       <div className="card">
         <div className="table-wrapper">
           <table className="table">
             <thead>
             <tr>
               <th>Teacher</th>
               <th>Gender</th>
               <th>Subjects</th>
               <th>Phone</th>
               <th>Joining Date</th>
               <th>Experience</th>
               <th>Status</th>
               <th style={{ textAlign: "right" }}>Actions</th>
             </tr>
             </thead>
             <tbody>
             {loading ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: "center", padding: 40 }}>
                    <div className="spinner" style={{ margin: "0 auto" }}/>
                  </td>
                </tr>
             ) : teachers.length === 0 ? (
                <tr>
                  <td colSpan={8}>
                    <div className="empty-state">
                      <Users/>
                      <strong>No teachers found</strong>
                      <p>{search ? "Try a different search term." : "Add your first teacher to get started."}</p>
                    </div>
                  </td>
                </tr>
             ) : (
                teachers.map((t) => (
                   <tr key={t.id}>
                     <td>
                       <div className="teacher-name-cell">
                         <div className="teacher-avatar">{getInitials(t.identity)}</div>
                         <div>
                           <div className="name">{getFullName(t.identity)}</div>
                           <div className="username">{t.identity?.email ?? "—"}</div>
                         </div>
                       </div>
                     </td>
                     <td>{t.identity?.gender ?? "—"}</td>
                     <td>
                       {t.subjects?.length
                          ? t.subjects.map((s) => (
                             <span key={s.id} className="badge badge-info" style={{ marginRight: 4 }}>
                              {s.subjectName}
                            </span>
                          ))
                          : <span style={{ color: "var(--gray-400)" }}>—</span>}
                     </td>
                     <td>{t.identity?.phone ?? "—"}</td>
                     <td>{t.joiningDate ?? "—"}</td>
                     <td>
                       {t.experience != null
                          ? `${t.experience} yr${t.experience !== 1 ? "s" : ""}`
                          : "—"}
                     </td>
                     <td>
                      <span className={STATUS_BADGE[t.teacherStatus] || "badge badge-gray"}>
                        {t.teacherStatus}
                      </span>
                     </td>
                     <td>
                       <div style={{ display: "flex", gap: 4, justifyContent: "flex-end" }}>
                         <button className="btn btn-ghost btn-icon" title="Edit" onClick={() => handleEdit(t)}>
                           <Pencil style={{ width: 15, height: 15 }}/>
                         </button>
                         <button
                            className="btn btn-ghost btn-icon"
                            title="Delete"
                            style={{ color: "var(--danger)" }}
                            onClick={() => setDeleteTarget(t)}
                         >
                           <Trash2 style={{ width: 15, height: 15 }}/>
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
       
       <TeacherFormModal
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSubmit={handleSubmit}
          initial={editTarget}
          subjects={subjects}
          schoolId={schoolId}
          loading={saving}
       />
       
       <ConfirmDialog
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          loading={deleting}
          title="Delete Teacher"
          message={`Are you sure you want to delete ${deleteTarget ? getFullName(deleteTarget.identity)
             : "this teacher"}? This action cannot be undone.`}
       />
       
       <ToastContainer toasts={toasts}/>
     </div>
  );
}