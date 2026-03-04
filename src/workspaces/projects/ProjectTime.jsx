import React from 'react';

export default function ProjectTime() {
  return (
    <div className="bg-white p-8 rounded-2xl border border-gray-100">
        <div className="flex justify-between items-end mb-10">
            <div>
                <h3 className="text-3xl font-black text-gray-900 tracking-tight">38.5</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Total Hours This Week</p>
            </div>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-blue-100">Toggle Timer</button>
        </div>
        <div className="space-y-3">
            {[
                { task: "Design Review", project: "Website Redesign", time: "4.5h", date: "Today" },
                { task: "Scrum Daily", project: "Multiple", time: "1.0h", date: "Today" },
                { task: "Bug Fixing", project: "Mobile App", time: "6.0h", date: "Yesterday" },
            ].map((entry, i) => (
                <div key={i} className="flex items-center justify-between p-4 border border-gray-50 rounded-xl hover:bg-gray-50 transition-colors">
                    <div>
                        <p className="font-bold text-gray-800 text-sm">{entry.task}</p>
                        <p className="text-[10px] text-gray-400 uppercase tracking-wider font-black mt-0.5">{entry.project}</p>
                    </div>
                    <div className="text-right">
                        <p className="font-black text-gray-900">{entry.time}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{entry.date}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
  );
}
