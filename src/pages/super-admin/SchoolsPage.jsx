import { useState, useEffect, useCallback } from "react";
import { Plus, Search, Pencil, Power, School as SchoolIcon } from "lucide-react";
import { schoolApi } from "@/services/schoolApi";
import { useToast } from "@/hooks/useToast";
import ToastContainer from "@/components/ui/ToastContainer";
import SchoolFormModal from "./SchoolFormModal";

const STATUS_CLASS = {
  ACTIVE: "active", INACTIVE: "inactive", HOLIDAY: "holiday",
  EXAM: "exam", CLOSED: "closed", DELETED: "deleted",
};

const STATUSES = ["ACTIVE", "INACTIVE", "HOLIDAY", "EXAM", "CLOSED", "DELETED"];

function unwrap (res) {
  const d = res.data?.data;
  if (!d) return [];
  return d.data ?? d.content ?? (Array.isArray(d) ? d : []);
}

export default function SchoolsPage () {
  const { toasts, toast } = useToast();
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  
  const fetchSchools = useCallback(async () => {
    setLoading(true);
    try {
      const res = search.trim()
         ? await schoolApi.searchByName(search.trim())
         : await schoolApi.getAll(0, 100);
      setSchools(unwrap(res));
    } catch (err) {
      toast({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  }, [search]);
  
  useEffect(() => {
    const t = setTimeout(fetchSchools, 300);
    return () => clearTimeout(t);
  }, [fetchSchools]);
  
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
        await schoolApi.update(editTarget.id, payload);
        toast({ message: "School updated successfully" });
      } else {
        await schoolApi.create(payload);
        toast({ message: "School created successfully" });
      }
      setFormOpen(false);
      fetchSchools();
    } catch (err) {
      toast({ message: err.message, type: "error" });
    } finally {
      setSaving(false);
    }
  };
  
  const handleToggleStatus = async (school) => {
    const newStatus = school.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    try {
      await schoolApi.updateStatus(school.id, newStatus);
      toast({ message: `School marked ${newStatus.toLowerCase()}` });
      fetchSchools();
    } catch (err) {
      toast({ message: err.message, type: "error" });
    }
  };
  
  return (
     <div>
       <div className="sa-page-header">
         <h2>Schools</h2>
         <p>Onboard and manage schools on the Skooly platform.</p>
       </div>
       
       <div className="sa-toolbar">
         <div className="sa-search">
           <Search size={15}/>
           <input placeholder="Search schools by name..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}/>
         </div>
         <button className="sa-btn" style={{ marginLeft: "auto" }} onClick={handleAdd}>
           <Plus size={15}/> Add School
         </button>
       </div>
       
       <div className="sa-table-card">
         <table className="sa-table">
           <thead>
           <tr>
             <th>School</th>
             <th>Code</th>
             <th>Contact</th>
             <th>Status</th>
             <th style={{ textAlign: "right" }}>Actions</th>
           </tr>
           </thead>
           <tbody>
           {loading ? (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: 40, color: "#64748B" }}>Loading…</td>
              </tr>
           ) : schools.length === 0 ? (
              <tr>
                <td colSpan={5}>
                  <div className="sa-empty">
                    <SchoolIcon size={32}/>
                    <strong>No schools found</strong>
                    <p>{search ? "Try a different search." : "Add your first school to get started."}</p>
                  </div>
                </td>
              </tr>
           ) : (
              schools.map((s) => (
                 <tr key={s.id}>
                   <td><strong>{s.schoolName}</strong></td>
                   <td>{s.schoolCode || "—"}</td>
                   <td>
                     <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                       <span>{s.email || "—"}</span>
                       <span style={{ color: "#64748B", fontSize: 12 }}>{s.phone || "—"}</span>
                     </div>
                   </td>
                   <td><span className={`sa-badge ${STATUS_CLASS[s.status] ?? "inactive"}`}>{s.status}</span></td>
                   <td>
                     <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                       <button className="sa-btn outline sa-btn-sm" onClick={() => handleEdit(s)}>
                         <Pencil size={13}/> Edit
                       </button>
                       <button className="sa-btn outline sa-btn-sm" onClick={() => handleToggleStatus(s)}>
                         <Power size={13}/> {s.status === "ACTIVE" ? "Deactivate" : "Activate"}
                       </button>
                     </div>
                   </td>
                 </tr>
              ))
           )}
           </tbody>
         </table>
       </div>
       
       <SchoolFormModal
          open={formOpen}
          onClose={() => setFormOpen(false)}
          onSubmit={handleSubmit}
          initial={editTarget}
          loading={saving}
          statuses={STATUSES}
       />
       
       <ToastContainer toasts={toasts}/>
     </div>
  );
}