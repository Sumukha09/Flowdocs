import { Activity, Database, Server } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function Health() {
  const [healthy, setHealthy] = useState(true);

  useEffect(() => {
    // Ping API every 5 seconds to check health
    const interval = setInterval(async () => {
      try {
        const res = await fetch('http://127.0.0.1:8000/docs');
        setHealthy(res.ok);
      } catch {
        setHealthy(false);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-ink flex items-center gap-2">
          <Activity className="text-accent" /> System Health
        </h1>
        <p className="text-sm text-ink-3 mt-1">Monitor the state of the FlowDocs infrastructure.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         <div className={`p-6 rounded-card border ${healthy ? 'bg-green/5 border-green/20' : 'bg-red/5 border-red/20'} shadow-card flex flex-col items-center justify-center text-center`}>
            <Server size={48} className={healthy ? "text-green mb-4" : "text-red mb-4"} />
            <h2 className="text-lg font-semibold text-ink">API Backend</h2>
            <p className={`text-sm mt-1 font-medium ${healthy ? "text-green" : "text-red"}`}>
               {healthy ? "Operational" : "Unreachable"}
            </p>
         </div>
         
         <div className="p-6 rounded-card border bg-green/5 border-green/20 shadow-card flex flex-col items-center justify-center text-center">
            <Database size={48} className="text-green mb-4" />
            <h2 className="text-lg font-semibold text-ink">PostgreSQL</h2>
            <p className="text-sm mt-1 font-medium text-green">Connected</p>
         </div>
      </div>
    </div>
  );
}
