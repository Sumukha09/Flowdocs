import Sidebar from './Sidebar';
import StatusBar from './StatusBar';

export default function Layout({ children }) {
  return (
    <div className="app-shell flex flex-col h-screen overflow-hidden bg-canvas text-ink font-sans">
      <div className="app-body flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="app-main flex-1 overflow-y-auto relative">
          {children}
        </main>
      </div>
      <StatusBar />
    </div>
  );
}
