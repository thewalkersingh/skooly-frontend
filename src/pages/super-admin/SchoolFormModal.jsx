import { useState, useEffect } from "react";
import { X } from "lucide-react";

const EMPTY = { schoolName: "", schoolCode: "", address: "", phone: "", email: "", logoUrl: "", status: "ACTIVE" };

export default function SchoolFormModal ({ open, onClose, onSubmit, initial, loading, statuses }) {
  const [form, setForm] = useState(EMPTY);
  const isEdit = !!initial;
  
  useEffect(() => {
    if (!open) return;
    setForm(initial ? {
      schoolName: initial.schoolName ?? "",
      schoolCode: initial.schoolCode ?? "",
      address: initial.address ?? "",
      phone: initial.phone ?? "",
      email: initial.email ?? "",
      logoUrl: initial.logoUrl ?? "",
      status: initial.status ?? "ACTIVE",
    } : EMPTY);
  }, [initial, open]);
  
  if (!open) return null;
  
  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...form, schoolStatus: form.status });
  };
  
  return (
     <div className="sa-modal-overlay" onClick={onClose}>
       <div className="sa-modal" onClick={(e) => e.stopPropagation()}>
         <div className="sa-modal-header">
           <h3>{isEdit ? "Edit School" : "Add New School"}</h3>
           <button className="sa-modal-close" onClick={onClose}><X size={18}/></button>
         </div>
         <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", flex: 1, minHeight: 0 }}>
           <div className="sa-modal-body">
             <div className="sa-field">
               <label>School Name *</label>
               <input value={form.schoolName} onChange={set("schoolName")} required maxLength={100}/>
             </div>
             <div className="sa-form-grid">
               <div className="sa-field">
                 <label>School Code</label>
                 <input value={form.schoolCode} onChange={set("schoolCode")} maxLength={20}/>
               </div>
               <div className="sa-field">
                 <label>Status</label>
                 <select value={form.status} onChange={set("status")}>
                   {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                 </select>
               </div>
               <div className="sa-field">
                 <label>Phone</label>
                 <input value={form.phone} onChange={set("phone")} maxLength={15}/>
               </div>
               <div className="sa-field">
                 <label>Email</label>
                 <input type="email" value={form.email} onChange={set("email")}/>
               </div>
             </div>
             <div className="sa-field">
               <label>Address</label>
               <textarea rows={2} value={form.address} onChange={set("address")}/>
             </div>
             <div className="sa-field">
               <label>Logo URL</label>
               <input value={form.logoUrl} onChange={set("logoUrl")}/>
             </div>
           </div>
           <div className="sa-modal-footer">
             <button type="button" className="sa-btn outline" onClick={onClose}>Cancel</button>
             <button type="submit" className="sa-btn" disabled={loading}>
               {loading ? "Saving…" : isEdit ? "Save Changes" : "Create School"}
             </button>
           </div>
         </form>
       </div>
     </div>
  );
}