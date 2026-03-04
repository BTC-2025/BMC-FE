import { useState, useEffect, useRef } from 'react';

export default function LiveStreamTerminal() {
  const [logs, setLogs] = useState([]);
  const containerRef = useRef(null);

  const generateLog = () => {
    const systems = ['AUTH', 'DB-CLUSTER', 'SYNC-ENGINE', 'QUERY-PROX', 'ANALYTICS-NODE-42'];
    const actions = ['FETCH', 'CALCULATE', 'SYNC', 'OPTIMIZE', 'PEER-LINK'];
    const system = systems[Math.floor(Math.random() * systems.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];
    const status = Math.random() > 0.1 ? 'OK' : 'VAR';
    const latency = Math.floor(Math.random() * 50) + 5;
    const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false, fractionalSecondDigits: 3 });

    return {
      id: Date.now() + Math.random(),
      timestamp,
      system,
      action,
      status,
      latency: `${latency}ms`,
      packet: `0x${Math.random().toString(16).substring(2, 10).toUpperCase()}`
    };
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setLogs(prev => {
        const next = [...prev, generateLog()];
        return next.slice(-8); // Keep last 8 logs
      });
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-black/95 rounded-[40px] p-8 border border-white/10 shadow-2xl relative overflow-hidden font-mono text-left min-h-[350px] flex flex-col group">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.4em]">Live Data Stream</h4>
        </div>
        <div className="px-3 py-1 bg-white/5 rounded-full border border-white/10">
          <span className="text-[8px] font-bold text-gray-500 uppercase tracking-widest">TLS 1.3 Secured</span>
        </div>
      </div>

      <div className="flex-1 space-y-3 overflow-hidden" ref={containerRef}>
        {logs.map((log) => (
          <div 
            key={log.id} 
            className="flex items-center gap-4 text-[10px] animate-in slide-in-from-left duration-300"
          >
            <span className="text-gray-600 shrink-0">[{log.timestamp}]</span>
            <span className="text-blue-400 font-bold w-24 shrink-0">{log.system}</span>
            <span className="text-gray-400 w-16 uppercase shrink-0">{log.action}</span>
            <span className="text-emerald-500 font-bold shrink-0">{log.packet}</span>
            <span className={`px-2 py-0.5 rounded text-[8px] font-black ${log.status === 'OK' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
              {log.status}
            </span>
            <span className="text-gray-600 ml-auto tabular-nums">{log.latency}</span>
          </div>
        ))}
        {logs.length === 0 && (
          <div className="flex items-center gap-2 text-[10px] text-gray-600 italic">
            <span className="animate-pulse">Initializing stream...</span>
          </div>
        )}
      </div>

      <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none group-hover:bg-blue-500/20 transition-all duration-700"></div>
    </div>
  );
}
