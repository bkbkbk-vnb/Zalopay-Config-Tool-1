import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ParsedData } from '../types';

interface AnalyticsDashboardProps {
    data: ParsedData;
}

export default function AnalyticsDashboard({ data }: AnalyticsDashboardProps) {
    // Aggregate data for KPIs
    const totalCards = data.cardUIConfig.length;
    const activeCards = data.displayRules.filter(r => r.Status === 'ACTIVE').length;
    const draftCards = data.displayRules.filter(r => r.Status === 'DRAFT').length;

    // Chart 1: Cards by Partner (Pie)
    const partnerCounts = data.cardUIConfig.reduce((acc, card) => {
        acc[card.Partner_ID] = (acc[card.Partner_ID] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const partnerPieData = Object.entries(partnerCounts).map(([id, count], index) => {
        const pName = data.partnerMaster.find(p => p.Partner_ID === id)?.Partner_Name || id;
        return {
            name: pName,
            value: count,
            color: `hsl(${(index * 60 + 200) % 360}, 65%, 50%)`
        };
    });

    // Chart: Cards by Category (Pie)
    const categoryCounts = data.cardUIConfig.reduce((acc, card) => {
        const cat = card.Service_Group || 'Others';
        acc[cat] = (acc[cat] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const categoryPieData = Object.entries(categoryCounts).map(([name, value], index) => ({
        name,
        value,
        color: `hsl(${(index * 137.5 + 40) % 360}, 60%, 55%)`
    }));

    // Chart 2: Status Distribution
    const pieData = [
        { name: 'Active', value: activeCards, color: '#10b981' }, // Emerald
        { name: 'Draft', value: draftCards, color: '#f59e0b' },   // Amber
        { name: 'Inactive', value: totalCards - activeCards - draftCards, color: '#94a3b8' } // Slate
    ];

    // Mock Audit Logs
    const auditLogs = [
        { id: 1, time: '2026-02-28 10:30', user: 'Product Owner (Alice)', action: 'PUBLISHED', target: 'CFG_CATHAY_001' },
        { id: 2, time: '2026-02-28 09:15', user: 'Business Specialist (Bob)', action: 'EDITED', target: 'CFG_CATHAY_001' },
        { id: 3, time: '2026-02-27 16:45', user: 'Business Specialist (Bob)', action: 'CREATED', target: 'CFG_SHB_001' },
        { id: 4, time: '2026-02-27 11:20', user: 'System', action: 'AUTO_DEACTIVATED', target: 'CFG_OLD_PROMO_01' },
        { id: 5, time: '2026-02-26 14:00', user: 'Product Owner (Alice)', action: 'ROLLED_BACK', target: 'CFG_CAKE_001' },
    ];

    return (
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
            <header className="bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-center shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Activity & Analytics</h1>
                    <p className="text-slate-500 text-sm mt-1">Track configuration performance and system audit logs.</p>
                </div>
            </header>

            <div className="flex-1 overflow-auto p-8">
                <div className="max-w-6xl mx-auto space-y-6">

                    {/* KPI Cards */}
                    <div className="grid grid-cols-4 gap-6">
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-slate-500 font-bold text-[11px] uppercase tracking-wider">Total Cards</h3>
                            <p className="text-3xl font-bold text-slate-800 mt-2">{totalCards}</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-emerald-500 hover:shadow-md transition-shadow">
                            <h3 className="text-slate-500 font-bold text-[11px] uppercase tracking-wider">Active Now</h3>
                            <p className="text-3xl font-bold text-emerald-600 mt-2">{activeCards}</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm border-l-4 border-l-yellow-500 hover:shadow-md transition-shadow">
                            <h3 className="text-slate-500 font-bold text-[11px] uppercase tracking-wider">Drafts Pending</h3>
                            <p className="text-3xl font-bold text-yellow-600 mt-2">{draftCards}</p>
                        </div>
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-slate-500 font-bold text-[11px] uppercase tracking-wider">Dev Time Saved</h3>
                            <p className="text-3xl font-bold text-blue-600 mt-2">120h</p>
                        </div>
                    </div>

                    {/* Charts Row */}
                    <div className="grid grid-cols-3 gap-6">
                        {/* Status Distribution */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center">
                            <h3 className="text-slate-800 font-bold text-sm self-start mb-4">Status Distribution</h3>
                            <div className="w-full h-56">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={8}
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mt-2">
                                {pieData.map(d => (
                                    <div key={d.name} className="flex items-center gap-1.5">
                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }}></div>
                                        <span className="text-[10px] font-bold text-slate-500 uppercase">{d.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Partner Distribution */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center">
                            <h3 className="text-slate-800 font-bold text-sm self-start mb-4">Cards by Partner</h3>
                            <div className="w-full h-56">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={partnerPieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={0}
                                            outerRadius={80}
                                            paddingAngle={2}
                                            dataKey="value"
                                        >
                                            {partnerPieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-2">
                                {partnerPieData.slice(0, 4).map(d => (
                                    <div key={d.name} className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></div>
                                        <span className="text-[10px] text-slate-600 font-medium truncate max-w-[80px]">{d.name}</span>
                                    </div>
                                ))}
                                {partnerPieData.length > 4 && <span className="text-[10px] text-slate-400">+{partnerPieData.length - 4} more</span>}
                            </div>
                        </div>

                        {/* Category Distribution */}
                        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center">
                            <h3 className="text-slate-800 font-bold text-sm self-start mb-4">Cards by Category</h3>
                            <div className="w-full h-56">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={categoryPieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={80}
                                            paddingAngle={4}
                                            dataKey="value"
                                        >
                                            {categoryPieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-2">
                                {categoryPieData.slice(0, 4).map(d => (
                                    <div key={d.name} className="flex items-center gap-1.5">
                                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: d.color }}></div>
                                        <span className="text-[10px] text-slate-600 font-medium truncate max-w-[80px]">{d.name}</span>
                                    </div>
                                ))}
                                {categoryPieData.length > 4 && <span className="text-[10px] text-slate-400">+{categoryPieData.length - 4} more</span>}
                            </div>
                        </div>
                    </div>

                    {/* Audit Log Table */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="p-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                            <h3 className="text-slate-800 font-bold">System Audit Logs</h3>
                            <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">Export CSV</button>
                        </div>
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500 border-b border-slate-200">
                                    <th className="px-6 py-3 font-medium">Timestamp</th>
                                    <th className="px-6 py-3 font-medium">User Role</th>
                                    <th className="px-6 py-3 font-medium">Action</th>
                                    <th className="px-6 py-3 font-medium">Target Config</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {auditLogs.map(log => (
                                    <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4 text-sm text-slate-500">{log.time}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-800">{log.user}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-2 py-1 rounded text-[10px] font-bold ${log.action === 'PUBLISHED' ? 'bg-emerald-100 text-emerald-700' :
                                                log.action === 'EDITED' ? 'bg-blue-100 text-blue-700' :
                                                    log.action === 'ROLLED_BACK' ? 'bg-purple-100 text-purple-700' :
                                                        'bg-slate-100 text-slate-700'
                                                }`}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-600 font-mono">{log.target}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
    );
}
