import {useState, useEffect} from "react";
import {X} from "lucide-react";
import {classroomApi} from "@/services/classroomApi";
import {sectionApi} from "@/services/sectionApi";

const GENDERS = ["MALE", "FEMALE", "OTHER"];
const STATUSES = ["ACTIVE", "INACTIVE", "GRADUATED", "TRANSFERRED"];

const EMPTY = {
   firstName: "", lastName: "", dob: "", gender: "",
   street: "", city: "", state: "", country: "", zipCode: "",
   phone: "", email: "", admissionDate: "",
   classId: "", sectionId: "", parentId: "",
   status: "ACTIVE", username: "", password: "",
};

function SectionLabel({text}) {
   return (
       <p style={{
          fontSize: "var(--font-size-xs)", fontWeight: 600, color: "var(--gray-500)",
          textTransform: "uppercase", letterSpacing: "0.05em", margin: "16px 0 12px",
       }}>
          {text}
       </p>
   );
}

export default function StudentFormModal({
                                            open,
                                            onClose,
                                            onSubmit,
                                            initial,
                                            classes,
                                            sections,
                                            parents,
                                            loading
                                         }) {
   const [form, setForm] = useState(EMPTY);
   const isEdit = !!initial;

   const filteredSections = form.classId
       ? sections.filter((s) => String(s.classroomId) === String(form.classId))
       : sections;

   useEffect(() => {
      if (!open) return;
      if (initial) {
         // Find the classId from the section
         let classId = "";
         if (initial.sectionId) {
            const section = sections.find(s => s.id === initial.sectionId);
            classId = section?.classroomId || "";
         }

         setForm({
            firstName: initial.identity?.firstName ?? "",
            lastName: initial.identity?.lastName ?? "",
            dob: initial.dob ?? "",
            gender: initial.identity?.gender ?? "",
            street: initial.address?.street ?? "",
            city: initial.address?.city ?? "",
            state: initial.address?.state ?? "",
            country: initial.address?.country ?? "",
            zipCode: initial.address?.zipCode ?? "",
            phone: initial.identity?.phone ?? "",
            email: initial.identity?.email ?? "",
            admissionDate: initial.admissionDate ?? "",
            classId: classId,  // Now properly set
            sectionId: initial.sectionId ?? "",
            parentId: initial.parent?.id ?? "",
            status: initial.studentStatus ?? "ACTIVE",
            username: initial.identity?.username ?? "",
            password: "",
         });
      } else {
         setForm(EMPTY);
      }
   }, [initial, open, sections]); // Added sections to dependencies

   if (!open) return null;

   const set = (field) => (e) => {
      setForm((f) => {
         const updated = {...f, [field]: e.target.value};
         if (field === "classId") updated.sectionId = "";
         return updated;
      });
   };

   const handleSubmit = (e) => {
      e.preventDefault();
      const payload = {
         firstName: form.firstName,
         lastName: form.lastName,
         dob: form.dob || null,
         gender: form.gender || null,
         address: {
            street: form.street || null,
            city: form.city || null,
            state: form.state || null,
            country: form.country || null,
            zipCode: form.zipCode || null,
         },
         phone: form.phone || null,
         email: form.email || null,
         admissionDate: form.admissionDate || null,
         sectionId: form.sectionId ? Number(form.sectionId) : null,
         parentId: form.parentId ? Number(form.parentId) : null,
         studentStatus: form.status,
         username: form.username,
      };
      if (!isEdit || form.password) payload.password = form.password;
      onSubmit(payload);
   };

   return (
       <div className="modal-overlay" onClick={onClose}>
          <div
              className="modal"
              style={{maxWidth: 640, display: "flex", flexDirection: "column", maxHeight: "90vh"}}
              onClick={(e) => e.stopPropagation()}
          >
             <div className="modal-header" style={{flexShrink: 0}}>
                <h3>{isEdit ? "Edit Student" : "Add New Student"}</h3>
                <button className="modal-close" onClick={onClose}><X/></button>
             </div>

             <form onSubmit={handleSubmit} style={{display: "flex", flexDirection: "column", flex: 1, minHeight: 0}}>
                <div className="modal-body" style={{overflowY: "auto", flex: 1}}>

                   <SectionLabel text="Personal Information"/>
                   <div className="form-grid">
                      <div className="form-group">
                         <label className="form-label required">First Name</label>
                         <input className="form-input" value={form.firstName} onChange={set("firstName")} required/>
                      </div>
                      <div className="form-group">
                         <label className="form-label required">Last Name</label>
                         <input className="form-input" value={form.lastName} onChange={set("lastName")} required/>
                      </div>
                      <div className="form-group">
                         <label className="form-label">Date of Birth</label>
                         <input className="form-input" type="date" value={form.dob} onChange={set("dob")}/>
                      </div>
                      <div className="form-group">
                         <label className="form-label">Gender</label>
                         <select className="form-select" value={form.gender} onChange={set("gender")}>
                            <option value="">— Select —</option>
                            {GENDERS.map((g) => <option key={g} value={g}>{g}</option>)}
                         </select>
                      </div>
                      <div className="form-group">
                         <label className="form-label">Phone</label>
                         <input className="form-input" value={form.phone} onChange={set("phone")}/>
                      </div>
                      <div className="form-group">
                         <label className="form-label">Email</label>
                         <input className="form-input" type="email" value={form.email} onChange={set("email")}/>
                      </div>
                   </div>

                   <SectionLabel text="Address"/>
                   <div className="form-grid">
                      <div className="form-group">
                         <label className="form-label">Street</label>
                         <input className="form-input" value={form.street} onChange={set("street")}/>
                      </div>
                      <div className="form-group">
                         <label className="form-label">City</label>
                         <input className="form-input" value={form.city} onChange={set("city")}/>
                      </div>
                      <div className="form-group">
                         <label className="form-label">State</label>
                         <input className="form-input" value={form.state} onChange={set("state")}/>
                      </div>
                      <div className="form-group">
                         <label className="form-label">Country</label>
                         <input className="form-input" value={form.country} onChange={set("country")}/>
                      </div>
                      <div className="form-group">
                         <label className="form-label">Zip Code</label>
                         <input className="form-input" value={form.zipCode} onChange={set("zipCode")}/>
                      </div>
                   </div>

                   <SectionLabel text="Enrollment"/>
                   <div className="form-grid">
                      <div className="form-group">
                         <label className="form-label">Admission Date</label>
                         <input className="form-input"
                                type="date"
                                value={form.admissionDate}
                                onChange={set("admissionDate")}/>
                      </div>
                      <div className="form-group">
                         <label className="form-label">Status</label>
                         <select className="form-select" value={form.status} onChange={set("status")}>
                            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                         </select>
                      </div>
                      <div className="form-group">
                         <label className="form-label">Class</label>
                         <select className="form-select" value={form.classId} onChange={set("classId")}>
                            <option value="">— Select Class —</option>
                            {classes.map((c) => <option key={c.id} value={c.id}>{c.classroomName}</option>)}
                         </select>
                      </div>
                      <div className="form-group">
                         <label className="form-label">Section</label>
                         <select className="form-select"
                                 value={form.sectionId}
                                 onChange={set("sectionId")}
                                 disabled={!form.classId}>
                            <option value="">— Select Section —</option>
                            {filteredSections.map((s) => <option key={s.id} value={s.id}>{s.sectionName}</option>)}
                         </select>
                      </div>
                      <div className="form-group">
                         <label className="form-label">Parent</label>
                         <select className="form-select" value={form.parentId} onChange={set("parentId")}>
                            <option value="">— Select Parent —</option>
                            {parents.map((p) => (
                                <option key={p.id} value={p.id}>
                                   {p.identity?.firstName} {p.identity?.lastName}
                                </option>
                            ))}
                         </select>
                      </div>
                   </div>

                   <SectionLabel text="Login Account"/>
                   <div className="form-grid">
                      <div className="form-group">
                         <label className="form-label required">Username</label>
                         <input
                             className="form-input"
                             value={form.username}
                             onChange={set("username")}
                             required
                             disabled={isEdit}
                         />
                      </div>
                      <div className="form-group">
                         <label className={isEdit ? "form-label" : "form-label required"}>
                            Password{" "}
                            {isEdit &&
                                <span style={{fontWeight: 400, color: "var(--gray-400)"}}>(leave blank to keep)</span>}
                         </label>
                         <input
                             className="form-input"
                             type="password"
                             value={form.password}
                             onChange={set("password")}
                             required={!isEdit}
                         />
                      </div>
                   </div>

                </div>

                <div className="modal-footer" style={{flexShrink: 0}}>
                   <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
                   <button type="submit" className="btn btn-primary" disabled={loading}>
                      {loading ? "Saving…" : isEdit ? "Save Changes" : "Add Student"}
                   </button>
                </div>
             </form>
          </div>
       </div>
   );
}