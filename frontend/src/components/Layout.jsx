import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import Sidebar from './Sidebar';

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
            {/* Mobile Header */}
            <div className="lg:hidden fixed top-0 w-full bg-white z-20 border-b border-slate-100 px-4 py-3 flex items-center justify-between">
                <div className="flex items-center">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-2 shadow-md">
                        <div className="w-4 h-4 bg-white rounded-md transform rotate-45 flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-indigo-600 rounded-sm"></div>
                        </div>
                    </div>
                    <h1 className="text-xl font-black text-slate-900 tracking-tighter">Edu<span className="text-indigo-600">Track</span></h1>
                </div>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                >
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div className="flex-1 flex flex-col overflow-hidden relative pt-16 lg:pt-0">
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50/50 p-4 lg:p-6">
                    <div className="container mx-auto max-w-7xl">
                        <Outlet />
                    </div>
                </main>
            </div>

            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}
        </div>
    );
};

export default Layout;
