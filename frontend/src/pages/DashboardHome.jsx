import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, Award, BarChart2 as ChartIcon } from 'lucide-react';
import { dashboardAPI } from '../api';

const DashboardHome = () => {
    const [data, setData] = useState({
        totalStudents: 0,
        successRate: 0,
        overallPerformance: 'N/A',
        studentData: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const response = await dashboardAPI.getStats();
            setData(response.data);
        } catch (err) {
            console.error("Error fetching dashboard data:", err);
        } finally {
            setLoading(false);
        }
    };

    const stats = [
        { title: 'Lead Count', value: data.leadCount || 0, change: '+5.2%', icon: Users, color: 'bg-indigo-500' },
        { title: 'Interested Leads', value: data.interestedCount || 0, change: '+1.2%', icon: TrendingUp, color: 'bg-emerald-500' },
        { title: 'Success Rate', value: `${data.successRate}%`, change: 'Stable', icon: Award, color: 'bg-purple-500' },
    ];

    const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444'];

    return (
        <div className="space-y-10 fade-in">
            <div>
                <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Analytics Dashboard</h1>
                <p className="text-slate-500 mt-1">Real-time overview of student registrations and performance metrics.</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                {stats.map((stat, index) => (
                    <div key={index} className="glass-card p-6 lg:p-8 rounded-[2rem] flex items-center space-x-6 hover:scale-[1.02] transition-transform duration-300">
                        <div className={`p-4 lg:p-5 rounded-2xl ${stat.color} shadow-lg shadow-${stat.color.replace('bg-', '')}/20 shrink-0`}>
                            <stat.icon className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
                        </div>
                        <div>
                            <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">{stat.title}</p>
                            <h3 className="text-2xl lg:text-3xl font-black text-slate-900 mt-0.5">{stat.value}</h3>
                            <div className="flex items-center mt-1.5 flex-wrap">
                                <span className={`text-xs font-bold ${stat.change.includes('+') ? 'text-emerald-500' : 'text-slate-400'} bg-${stat.change.includes('+') ? 'emerald' : 'slate'}-50 px-2 py-0.5 rounded-lg`}>
                                    {stat.change}
                                </span>
                                <span className="text-[10px] text-slate-400 ml-2 font-medium whitespace-nowrap">from last month</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-10">
                {/* Bar Chart */}
                <div className="bg-white p-6 lg:p-8 rounded-[2.5rem] shadow-sm border border-slate-100 scale-in" style={{ animationDelay: '0.1s' }}>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg lg:text-xl font-bold text-slate-900">Student Statistics</h3>
                            <p className="text-sm text-slate-400">Registrations by Department</p>
                        </div>
                        <div className="p-2 bg-slate-50 rounded-xl">
                            <ChartIcon className="w-5 h-5 text-slate-400" />
                        </div>
                    </div>
                    <div className="h-64 lg:h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data.studentData}>
                                <defs>
                                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#6366f1" />
                                        <stop offset="100%" stopColor="#a855f7" />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 10 }} dy={10} interval={0} angle={-15} textAnchor="end" height={60} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dx={-10} />
                                <Tooltip
                                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                                    cursor={{ fill: '#f8fafc', radius: 4 }}
                                />
                                <Bar dataKey="count" fill="url(#barGradient)" radius={[6, 6, 6, 6]} barSize={32} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart */}
                <div className="bg-white p-6 lg:p-8 rounded-[2.5rem] shadow-sm border border-slate-100 scale-in" style={{ animationDelay: '0.2s' }}>
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg lg:text-xl font-bold text-slate-900">Demographics</h3>
                            <p className="text-sm text-slate-400">Department distribution</p>
                        </div>
                    </div>
                    <div className="h-64 lg:h-80 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.studentData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    fill="#8884d8"
                                    paddingAngle={8}
                                    dataKey="count"
                                    strokeWidth={0}
                                >
                                    {data.studentData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardHome;
