import { NavLink, useParams } from 'react-router-dom';
import {
  LayoutDashboard,
  List,
  FileText,
  AlertTriangle,
  CheckSquare,
  CheckCircle,
  History,
  Activity,
  Workflow,
} from 'lucide-react';

export default function Sidebar() {
  const { id: runId } = useParams();

  const globalLinks = [
    { to: '/', icon: LayoutDashboard, label: 'Overview' },
    { to: '/runs', icon: List, label: 'Runs' },
  ];

  const runLinks = runId ? [
    { to: `/runs/${runId}`, icon: Activity, label: 'Run Timeline' },
    { to: `/runs/${runId}/documents`, icon: FileText, label: 'Documents' },
    { to: `/runs/${runId}/claims`, icon: CheckCircle, label: 'Claims & Evidence' },
    { to: `/runs/${runId}/findings`, icon: AlertTriangle, label: 'Findings & Conflicts' },
    { to: `/runs/${runId}/approvals`, icon: CheckSquare, label: 'Approvals' },
    { to: `/runs/${runId}/deliverable`, icon: FileText, label: 'Deliverable' },
    { to: `/runs/${runId}/audit`, icon: History, label: 'Changelog / Cost' },
  ] : [];

  const systemLinks = [
    { to: '/health', icon: Activity, label: 'System Health' },
  ];

  return (
    <aside className="app-sidebar flex flex-col">
      <div className="px-5 py-[18px] border-b border-line flex items-center gap-3">
        <div className="size-9 rounded-xl bg-accent text-white flex items-center justify-center shadow-btn"><Workflow size={18} /></div>
        <div>
          <span className="block font-bold tracking-tight text-ink leading-tight">FlowDocs</span>
          <span className="block text-[10px] text-ink-3 mt-0.5 tracking-[.12em] uppercase">Review workspace</span>
        </div>
      </div>

      <nav className="sidebar-links flex-1 overflow-y-auto py-5 px-3 space-y-7">
        <section>
          <div className="sidebar-group-label px-3 mb-2 text-[10px] font-bold text-ink-3 uppercase tracking-[.16em]">Workspace</div>
          <div className="sidebar-link-list space-y-1">
            {globalLinks.map(link => (
              <NavLink 
                key={link.to} 
                to={link.to}
                className={({ isActive }) =>
                  `sidebar-link flex items-center gap-3 px-3 py-2.5 text-[13px] rounded-control transition-colors ${
                    isActive ? 'bg-accent-tint text-accent-ink font-semibold' : 'text-ink-2 hover:bg-hover hover:text-ink'
                  }`
                }
              >
                <link.icon size={16} />
                {link.label}
              </NavLink>
            ))}
          </div>
        </section>

        {runLinks.length > 0 && (
          <section>
            <div className="sidebar-group-label px-3 mb-2 text-[10px] font-bold text-ink-3 uppercase tracking-[.16em] truncate" title={`Run Context: ${runId}`}>
              Active Run
            </div>
            <div className="sidebar-link-list space-y-1">
              {runLinks.map(link => (
                <NavLink 
                  key={link.to} 
                  to={link.to}
                  end
                  className={({ isActive }) =>
                    `sidebar-link flex items-center gap-3 px-3 py-2.5 text-[13px] rounded-control transition-colors ${
                      isActive ? 'bg-accent-tint text-accent-ink font-semibold' : 'text-ink-2 hover:bg-hover hover:text-ink'
                    }`
                  }
                >
                  <link.icon size={16} />
                  {link.label}
                </NavLink>
              ))}
            </div>
          </section>
        )}

        <section>
          <div className="sidebar-group-label px-3 mb-2 text-[10px] font-bold text-ink-3 uppercase tracking-[.16em]">System</div>
          <div className="sidebar-link-list space-y-1">
            {systemLinks.map(link => (
              <NavLink 
                key={link.label} 
                to={link.to}
                className={({ isActive }) =>
                  `sidebar-link flex items-center gap-3 px-3 py-2.5 text-[13px] rounded-control transition-colors ${
                    isActive ? 'bg-accent-tint text-accent-ink font-semibold' : 'text-ink-2 hover:bg-hover hover:text-ink'
                  }`
                }
              >
                <link.icon size={16} />
                {link.label}
              </NavLink>
            ))}
          </div>
        </section>
      </nav>
    </aside>
  );
}
