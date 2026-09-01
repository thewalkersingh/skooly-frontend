import { useState, useEffect, useCallback } from "react";
import { Check, X as XIcon, UserCheck } from "lucide-react";
import { accountApi } from "@/services/accountApi";
import { useToast } from "@/hooks/useToast";
import ToastContainer from "@/components/ui/ToastContainer";

const STATUS_CLASS = {
  PENDING: "pending",
  ACTIVE: "active",
  REJECTED: "rejected",
  INACTIVE: "inactive",
  DELETED: "deleted"
};

export default function PendingAccountsPage () {
  const { toasts, toast } = useToast();
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actingId, setActingId] = useState(null);
  
  const fetchPending = useCallback(async () => {
    setLoading(true);
    try {
      const res = await accountApi.getPending();
      setAccounts(res.data?.data ?? []);
    } catch (err) {
      toast({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  }, []);
  
  useEffect(() => { fetchPending(); }, [fetchPending]);
  
  const handleApprove = async (userId) => {
    setActingId(userId);
    try {
      await accountApi.approve(userId);
      toast({ message: "Account approved" });
      fetchPending();
    } catch (err) {
      toast({ message: err.message, type: "error" });
    } finally {
      setActingId(null);
    }
  };
  
  const handleReject = async (userId) => {
    const reason = window.prompt("Reason for rejection:");
    if (reason === null) return;
    setActingId(userId);
    try {
      await accountApi.reject(userId, reason || "Not specified");
      toast({ message: "Account rejected" });
      fetchPending();
    } catch (err) {
      toast({ message: err.message, type: "error" });
    } finally {
      setActingId(null);
    }
  };
  
  return (
     <div>
       <div className="sa-page-header">
         <h2>Pending Accounts</h2>
         <p>Review and approve account creation requests across all schools.</p>
       </div>
       
       <div className="sa-table-card">
         <table className="sa-table">
           <thead>
           <tr>
             <th>Name</th>
             <th>Contact</th>
             <th>Role</th>
             <th>Status</th>
             <th>Requested</th>
             <th style={{ textAlign: "right" }}>Actions</th>
           </tr>
           </thead>
           <tbody>
           {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: 40, color: "#64748B" }}>Loading…</td>
              </tr>
           ) : accounts.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className="sa-empty">
                    <UserCheck size={32}/>
                    <strong>No pending accounts</strong>
                    <p>All caught up — nothing waiting for approval.</p>
                  </div>
                </td>
              </tr>
           ) : (
              accounts.map((a) => (
                 <tr key={a.id}>
                   <td><strong>{a.firstName} {a.lastName}</strong></td>
                   <td>
                     <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                       <span>{a.email || "—"}</span>
                       <span style={{ color: "#64748B", fontSize: 12 }}>{a.phone || "—"}</span>
                     </div>
                   </td>
                   <td>{a.role}</td>
                   <td><span className={`sa-badge ${STATUS_CLASS[a.status] ?? "pending"}`}>{a.status}</span></td>
                   <td style={{ color: "#64748B", fontSize: 12 }}>
                     {a.createdAt ? new Date(a.createdAt).toLocaleDateString() : "—"}
                   </td>
                   <td>
                     <div style={{ display: "flex", gap: 6, justifyContent: "flex-end" }}>
                       <button
                          className="sa-btn sa-btn-sm"
                          disabled={actingId === a.id}
                          onClick={() => handleApprove(a.id)}
                       >
                         <Check size={13}/> Approve
                       </button>
                       <button
                          className="sa-btn danger sa-btn-sm"
                          disabled={actingId === a.id}
                          onClick={() => handleReject(a.id)}
                       >
                         <XIcon size={13}/> Reject
                       </button>
                     </div>
                   </td>
                 </tr>
              ))
           )}
           </tbody>
         </table>
       </div>
       
       <ToastContainer toasts={toasts}/>
     </div>
  );
}