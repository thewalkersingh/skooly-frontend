import { Settings } from "lucide-react";

export default function SettingsPage () {
  return (
     <div>
       <div className="sa-page-header">
         <h2>System Settings</h2>
         <p>Global configuration for the Skooly platform.</p>
       </div>
       <div className="sa-empty"
            style={{
              background: "#111827",
              border: "1px solid rgba(99,102,241,0.15)",
              borderRadius: 12,
              padding: 60
            }}>
         <Settings size={32}/>
         <strong>Coming soon</strong>
         <p>System-wide settings will live here.</p>
       </div>
     </div>
  );
}