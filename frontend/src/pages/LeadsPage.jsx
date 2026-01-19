import React, { useState, useEffect } from 'react';
import { Search, Plus, Filter, Download, Edit2, Trash2, Eye, UserPlus } from 'lucide-react';
import Modal from '../components/Modal';
import { studentAPI, courseAPI } from '../api';

const LeadsPage = () => {
    const [students, setStudents] = useState([]);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isAdmitModalOpen, setIsAdmitModalOpen] = useState(false);
    const [selectedStudent, setSelectedStudent] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', course: '', reply: 'Interested', additionalInfo: '', reminderDate: '', remind: false
    });

    // Admit Form State
    const [admitData, setAdmitData] = useState({
        joiningDate: new Date().toISOString().split('T')[0],
        fee: '',
        referralBonus: '0',
        referredBy: ''
    });

    useEffect(() => {
        fetchStudents();
        fetchCourses();
    }, []);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const response = await studentAPI.getAll();
            // Filter only leads
            setStudents(response.data.filter(s => !s.isAdmitted));
        } catch (err) {
            console.error("Error fetching students:", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCourses = async () => {
        try {
            const response = await courseAPI.getAll();
            setCourses(response.data);
        } catch (err) {
            console.error("Error fetching courses:", err);
        }
    };

    const handleAdd = () => {
        setFormData({ name: '', email: '', phone: '', course: '', reply: 'Interested', additionalInfo: '', reminderDate: '', remind: false });
        setIsAddModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            if (isEditModalOpen) {
                await studentAPI.update(selectedStudent._id, formData);
            } else {
                await studentAPI.add({ ...formData, date: new Date().toISOString().split('T')[0] });
            }
            fetchStudents();
            setIsAddModalOpen(false);
            setIsEditModalOpen(false);
        } catch (err) {
            console.error("Error saving student:", err);
        }
    };

    const handleAdmit = (student) => {
        setSelectedStudent(student);

        // Find the course fee for auto-fill
        const matchedCourse = courses.find(c => c.name === student.course || c.courseCode === student.course);
        const courseFee = matchedCourse ? matchedCourse.fees.total : '';

        setAdmitData({
            joiningDate: new Date().toISOString().split('T')[0],
            fee: courseFee,
            referralBonus: '0',
            referredBy: ''
        });
        setIsAdmitModalOpen(true);
    };

    const confirmAdmit = async (e) => {
        e.preventDefault();
        try {
            await studentAPI.admit(selectedStudent._id, admitData);
            fetchStudents();
            setIsAdmitModalOpen(false);
        } catch (err) {
            console.error("Error admitting student:", err);
        }
    };

    const handleView = (student) => {
        setSelectedStudent(student);
        setIsViewModalOpen(true);
    };

    const handleEdit = (student) => {
        setSelectedStudent(student);
        setFormData({ ...student });
        setIsEditModalOpen(true);
    };

    const handleDelete = (student) => {
        setSelectedStudent(student);
        setIsDeleteModalOpen(true);
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
        student.course?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.phone?.includes(searchTerm)
    );

    return (
        <div className="space-y-8 fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Leads Management</h1>
                    <p className="text-slate-500 mt-1">Track potential students and convert them into admissions.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search leads..."
                            className="input-field pl-10 w-64 shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <button onClick={handleAdd} className="btn-primary flex items-center">
                        <Plus className="w-4 h-4 mr-2" /> Add Lead
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-slate-200/60 overflow-hidden scale-in">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left min-w-[800px]">
                        <thead className="bg-slate-50/50 text-slate-500 font-semibold border-b border-slate-100 uppercase tracking-wider text-[11px]">
                            <tr>
                                <th className="px-6 py-5">Date</th>
                                <th className="px-6 py-5">Lead Name</th>
                                <th className="px-6 py-5">Contact</th>
                                <th className="px-6 py-5">Interest Status</th>
                                <th className="px-6 py-5">Interested Course</th>
                                <th className="px-6 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {filteredStudents.map((student) => (
                                <tr key={student._id} className="table-row-hover group">
                                    <td className="px-6 py-4 text-slate-500 font-medium">
                                        {student.createdAt ? new Date(student.createdAt).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-900">{student.name}</div>
                                        <div className="text-xs text-slate-400">{student.email}</div>
                                    </td>
                                    <td className="px-6 py-4 text-slate-600">{student.phone}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-tight ${student.reply === 'Interested' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                                            student.reply === 'Follow-up' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                                                'bg-slate-50 text-slate-500 border border-slate-100'
                                            }`}>
                                            {student.reply}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-slate-700">{student.course}</td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => handleAdmit(student)} className="p-2 hover:bg-emerald-50 text-emerald-600 rounded-xl transition-all title='Admit Student'"><UserPlus className="w-4 h-4" /></button>
                                            <button onClick={() => handleEdit(student)} className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-xl transition-all"><Edit2 className="w-4 h-4" /></button>
                                            <button onClick={() => handleDelete(student)} className="p-2 hover:bg-rose-50 text-rose-600 rounded-xl transition-all"><Trash2 className="w-4 h-4" /></button>
                                            <button onClick={() => handleView(student)} className="p-2 hover:bg-slate-100 text-slate-600 rounded-xl transition-all"><Eye className="w-4 h-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modals */}
            <Modal isOpen={isAddModalOpen || isEditModalOpen} onClose={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} title={isEditModalOpen ? "Edit Lead" : "Add New Lead"}>
                <form onSubmit={handleSave} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Name</label>
                            <input
                                className="input-field"
                                value={formData.name || ''}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Email</label>
                            <input
                                className="input-field"
                                value={formData.email || ''}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Phone</label>
                            <input
                                className="input-field"
                                value={formData.phone || ''}
                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Interested Course</label>
                            <select
                                className="input-field"
                                value={formData.course || ''}
                                onChange={(e) => setFormData({ ...formData, course: e.target.value })}
                                required
                            >
                                <option value="">Select a Course</option>
                                {courses.map(course => (
                                    <option key={course._id} value={course.name}>{course.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Status</label>
                        <select
                            className="input-field"
                            value={formData.reply || 'Interested'}
                            onChange={(e) => setFormData({ ...formData, reply: e.target.value })}
                        >
                            <option value="Interested">Interested</option>
                            <option value="Follow-up">Follow-up</option>
                            <option value="Not Interested">Not Interested</option>
                        </select>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase ml-1">Additional Info</label>
                        <textarea
                            className="input-field resize-none"
                            rows={3}
                            value={formData.additionalInfo || ''}
                            onChange={(e) => setFormData({ ...formData, additionalInfo: e.target.value })}
                        ></textarea>
                    </div>
                    <div className="flex justify-end pt-6 gap-3">
                        <button type="button" onClick={() => { setIsAddModalOpen(false); setIsEditModalOpen(false); }} className="btn-secondary">Cancel</button>
                        <button type="submit" className="btn-primary">Save Lead</button>
                    </div>
                </form>
            </Modal>

            {/* Admit Modal */}
            <Modal isOpen={isAdmitModalOpen} onClose={() => setIsAdmitModalOpen(false)} title="Admit Student">
                <form onSubmit={confirmAdmit} className="space-y-4">
                    <div className="p-4 bg-indigo-50 rounded-2xl mb-4 border border-indigo-100">
                        <p className="text-sm text-indigo-900 leading-relaxed font-medium">Converting <span className="font-black underline">{selectedStudent?.name}</span> to an Admitted Student.</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Joining Date</label>
                            <input
                                type="date"
                                className="input-field"
                                value={admitData.joiningDate}
                                onChange={(e) => setAdmitData({ ...admitData, joiningDate: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Fee Amount</label>
                            <input
                                type="number"
                                className="input-field"
                                placeholder="Total Fee"
                                value={admitData.fee}
                                onChange={(e) => setAdmitData({ ...admitData, fee: e.target.value })}
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Referral Bonus</label>
                            <input
                                type="number"
                                className="input-field"
                                value={admitData.referralBonus}
                                onChange={(e) => setAdmitData({ ...admitData, referralBonus: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Who Referred</label>
                            <input
                                className="input-field"
                                placeholder="Referrer Name"
                                value={admitData.referredBy}
                                onChange={(e) => setAdmitData({ ...admitData, referredBy: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end pt-6 gap-3">
                        <button type="button" onClick={() => setIsAdmitModalOpen(false)} className="btn-secondary">Cancel</button>
                        <button type="submit" className="btn-primary bg-emerald-600 hover:bg-emerald-700">Confirm Admission</button>
                    </div>
                </form>
            </Modal>

            <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Lead Details">
                {selectedStudent && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Name</label>
                                <p className="font-bold text-slate-900 text-lg">{selectedStudent.name}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Email</label>
                                <p className="font-bold text-slate-900 text-lg">{selectedStudent.email}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Phone</label>
                                <p className="font-bold text-slate-600 font-mono tracking-tighter">{selectedStudent.phone}</p>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Course</label>
                                <p className="font-bold text-indigo-600">{selectedStudent.course}</p>
                            </div>
                        </div>
                        <div className="flex justify-end">
                            <button onClick={() => setIsViewModalOpen(false)} className="btn-primary">Close</button>
                        </div>
                    </div>
                )}
            </Modal>

            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Delete">
                <div className="space-y-6">
                    <p className="text-slate-600 leading-relaxed">Are you sure you want to delete <span className="font-bold text-slate-900">{selectedStudent?.name}</span>? This action is permanent.</p>
                    <div className="flex justify-end gap-3">
                        <button onClick={() => setIsDeleteModalOpen(false)} className="btn-secondary">Cancel</button>
                        <button onClick={confirmDelete} className="px-6 py-2 bg-rose-600 text-white rounded-xl font-bold hover:bg-rose-700 transition-all">Delete</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default LeadsPage;
