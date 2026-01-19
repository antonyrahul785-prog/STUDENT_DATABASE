import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, Eye, Calendar, DollarSign, Award, ThumbsUp } from 'lucide-react';
import Modal from '../components/Modal';
import { studentAPI } from '../api';

const StudentsPage = () => {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    // Edit State
    const [formData, setFormData] = useState({});

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const response = await studentAPI.getAll();
            // Filter only admitted students
            setStudents(response.data.filter(s => s.isAdmitted));
        } catch (err) {
            console.error("Error fetching admitted students:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await studentAPI.update(selectedStudent._id, formData);
            fetchStudents();
            setIsEditModalOpen(false);
        } catch (err) {
            console.error("Error updating student:", err);
        }
    };

    const confirmDelete = async () => {
        try {
            await studentAPI.delete(selectedStudent._id);
            fetchStudents();
            setIsDeleteModalOpen(false);
        } catch (err) {
            console.error("Error deleting student:", err);
        }
    };

    const filteredStudents = students.filter(student =>
        student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.course?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isAdmin = user.role === 'admin';

    return (
        <div className="space-y-8 fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Admitted Students</h1>
                    <p className="text-slate-500 mt-1">Manage enrolled students, fees, and referral records.</p>
                </div>

                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search students..."
                        className="input-field pl-10 w-64 shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden scale-in">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left min-w-[900px]">
                        <thead className="bg-slate-50/50 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider text-[11px]">
                            <tr>
                                <th className="px-6 py-5">Joining Date</th>
                                <th className="px-6 py-5">Student</th>
                                <th className="px-6 py-5">Course</th>
                                {isAdmin && <th className="px-6 py-5">Fee</th>}
                                {isAdmin && <th className="px-6 py-5">Referral Details</th>}
                                <th className="px-6 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredStudents.map((student) => (
                                <tr key={student._id} className="table-row-hover group">
                                    <td className="px-6 py-4 text-slate-500 font-medium">
                                        {student.joiningDate ? new Date(student.joiningDate).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-900">{student.name}</div>
                                        <div className="text-xs text-slate-400">{student.phone}</div>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-700">{student.course}</td>
                                    {isAdmin && (
                                        <td className="px-6 py-4">
                                            <span className="font-bold text-indigo-600">₹{student.fee?.toLocaleString()}</span>
                                        </td>
                                    )}
                                    {isAdmin && (
                                        <td className="px-6 py-4">
                                            <div className="text-xs font-bold text-slate-900">By: {student.referredBy || 'Direct'}</div>
                                            <div className="text-[10px] text-emerald-600 font-black uppercase">Bonus: ₹{student.referralBonus || 0}</div>
                                        </td>
                                    )}
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => { setSelectedStudent(student); setFormData({ ...student }); setIsEditModalOpen(true); }} className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-xl transition-all"><Edit2 className="w-4 h-4" /></button>
                                            <button onClick={() => { setSelectedStudent(student); setIsDeleteModalOpen(true); }} className="p-2 hover:bg-rose-50 text-rose-600 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                                            <button onClick={() => { setSelectedStudent(student); setIsViewModalOpen(true); }} className="p-2 hover:bg-slate-100 text-slate-600 rounded-xl transition-all"><Eye className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals */}
            <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Edit Admitted Student">
                <form onSubmit={handleUpdate} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1 col-span-2">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Name</label>
                            <input className="input-field" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Fee</label>
                            <input type="number" className="input-field" value={formData.fee || ''} onChange={(e) => setFormData({ ...formData, fee: e.target.value })} />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Referral Bonus</label>
                            <input type="number" className="input-field" value={formData.referralBonus || ''} onChange={(e) => setFormData({ ...formData, referralBonus: e.target.value })} />
                        </div>
                    </div>
                    <div className="flex justify-end pt-6 gap-3">
                        <button type="button" onClick={() => setIsEditModalOpen(false)} className="btn-secondary">Cancel</button>
                        <button type="submit" className="btn-primary">Update Details</button>
                    </div>
                </form>
            </Modal>

            <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Student Profile">
                {selectedStudent && (
                    <div className="space-y-6">
                        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 rounded-[2rem] text-white shadow-xl">
                            <h3 className="text-2xl font-black">{selectedStudent.name}</h3>
                            <p className="opacity-80 font-medium">{selectedStudent.course} • Enrolled</p>
                            <div className="mt-4 flex gap-4">
                                <span className="bg-white/20 px-4 py-1 rounded-full text-xs font-bold">Fee: ₹{selectedStudent.fee}</span>
                                <span className="bg-white/20 px-4 py-1 rounded-full text-xs font-bold">Joined: {new Date(selectedStudent.joiningDate).toLocaleDateString()}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6 p-2">
                            <div className="flex items-center gap-3">
                                <ThumbsUp className="w-5 h-5 text-indigo-500" />
                                <div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">Referral Bonus</p>
                                    <p className="font-bold text-slate-900">₹{selectedStudent.referralBonus}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Calendar className="w-5 h-5 text-indigo-500" />
                                <div>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase">Referred By</p>
                                    <p className="font-bold text-slate-900">{selectedStudent.referredBy || 'Direct'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default StudentsPage;
