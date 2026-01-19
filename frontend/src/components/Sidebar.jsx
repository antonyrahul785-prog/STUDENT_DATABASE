import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Users, Share2, LogOut } from 'lucide-react';

const Sidebar = ({ onClose }) => {
    const navItems = [
        { name: 'Dashboard', icon: Home, path: '/dashboard' },
        { name: 'Leads', icon: Users, path: '/leads' },
        { name: 'Admitted Students', icon: Users, path: '/students' },
        { name: 'Share Platform', icon: Share2, path: '/share' },
    ];

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    return (
        <div className="h-full w-72 bg-white/80 backdrop-blur-xl border-r border-slate-100 flex flex-col transition-all duration-300">
            <div className="flex items-center px-8 h-24">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-3 shadow-lg shadow-indigo-200">
                    <div className="w-5 h-5 bg-white rounded-md transform rotate-45 flex items-center justify-center">
                        <div className="w-2 h-2 bg-indigo-600 rounded-sm"></div>
                    </div>
                </div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tighter">Edu<span className="text-indigo-600">Track</span></h1>
            </div>

            <nav className="flex-1 px-4 py-8 space-y-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        onClick={onClose}
                        className={({ isActive }) =>
                            `flex items-center px-6 py-4 rounded-2xl transition-all duration-300 group ${isActive
                                ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100 scale-[1.02]'
                                : 'text-slate-500 hover:bg-slate-50 hover:text-indigo-600'
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5 mr-4 transition-transform group-hover:scale-110" />
                        <span className="font-bold tracking-tight">{item.name}</span>
                    </NavLink>
                ))}
            </nav>

            <div className="p-6 border-t border-slate-50">
                <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-6 py-4 text-slate-400 font-bold rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-all duration-300 group"
                >
                    <LogOut className="w-5 h-5 mr-4 transition-transform group-hover:-translate-x-1" />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
