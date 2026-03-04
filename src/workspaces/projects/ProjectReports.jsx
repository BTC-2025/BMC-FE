import React from 'react';

export default function ProjectReports() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl border border-gray-100 aspect-[1.618/1] flex flex-col justify-between">
                <h3 className="font-black text-gray-900 mb-2">Weekly Performance</h3>
                <p className="text-xs text-gray-500 mb-8 font-medium">Progress tracked against active milestones.</p>
                <div className="h-40 bg-gray-50 rounded-xl border border-dashed border-gray-200 flex items-center justify-center">
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Chart Component Integration Pending</span>
                </div>
            </div>
            <div className="bg-white p-8 rounded-2xl border border-gray-100 aspect-[1.618/1] flex flex-col justify-between">
                <h3 className="font-black text-gray-900 mb-2">Resource Utilization</h3>
                <p className="text-xs text-gray-500 mb-8 font-medium">Team bandwidth across all projects.</p>
                <div className="h-40 bg-gray-50 rounded-xl border border-dashed border-gray-200 flex items-center justify-center">
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-[0.2em]">Data Visualization Required</span>
                </div>
            </div>
        </div>
    );
}
