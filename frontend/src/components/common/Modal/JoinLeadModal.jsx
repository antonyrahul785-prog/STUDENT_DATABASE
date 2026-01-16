import React, { useState, useEffect, useCallback } from 'react';
import BaseModal from './BaseModal';
import InputField from '../Form/InputField';
import SelectField from '../Form/SelectField';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';
import { leadService } from '../../../services/leadService';
import { courseService } from '../../../services/courseService';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

const JoinLeadModal = ({ isOpen, onClose, lead, onSuccess }) => {
  const [activeTab, setActiveTab] = useState(lead ? 'convert' : 'add');

  // AddLeadForm - extracted from AddLeadModal for embedding inside tabs
  const AddLeadForm = ({ onClose: close, onSuccess: success }) => {
    const [formData, setFormData] = useState({
      name: '',
      studentId: '',
      personalDetails: {
        fullName: '',
        phone: '',
        age: '',
        email: ''
      },
      paymentPlan: {
        totalFees: '',
        paidAmount: '',
        dueDate: ''
      }
    });
    const [errors, setErrors] = useState({});
    const queryClient = useQueryClient();

    const generateStudentId = () => {
      const year = new Date().getFullYear();
      const randomNum = Math.floor(1000 + Math.random() * 9000);
      return `STU-${year}-${randomNum}`;
    };

    const createLeadMutation = useMutation({
      mutationFn: (payload) => leadService.createLead(payload),
      onSuccess: (data) => {
        toast.success('Lead added successfully!');
        queryClient.invalidateQueries(['leads']);
        queryClient.invalidateQueries(['leadStats']);
        success?.();
        close?.();
      },
      onError: (error) => {
        toast.error(error.message || 'Failed to add lead');
        console.error('Create lead error:', error);
      }
    });

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      if (name.startsWith('personalDetails.')) {
        const field = name.split('.')[1];
        setFormData(prev => ({
          ...prev,
          personalDetails: {
            ...prev.personalDetails,
            [field]: value
          }
        }));
      } else if (name.startsWith('paymentPlan.')) {
        const field = name.split('.')[1];
        setFormData(prev => ({
          ...prev,
          paymentPlan: {
            ...prev.paymentPlan,
            [field]: value
          }
        }));
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }

      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    };

    const handleStudentIdFocus = () => {
      if (!formData.studentId) {
        setFormData(prev => ({ ...prev, studentId: generateStudentId() }));
      }
    };

    const handleSubmit = (e) => {
      e.preventDefault();

      const validationErrors = {};
      if (!formData.personalDetails.fullName.trim()) validationErrors.fullName = 'Full name is required';
      if (!formData.personalDetails.email.trim()) validationErrors.email = 'Email is required';
      else if (!/\S+@\S+\.\S+/.test(formData.personalDetails.email)) validationErrors.email = 'Email is invalid';
      if (!formData.personalDetails.phone.trim()) validationErrors.phone = 'Phone number is required';
      if (formData.paymentPlan.totalFees && isNaN(formData.paymentPlan.totalFees)) validationErrors.totalFees = 'Total fees must be a number';
      if (formData.paymentPlan.paidAmount && isNaN(formData.paymentPlan.paidAmount)) validationErrors.paidAmount = 'Paid amount must be a number';

      if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        toast.error('Please fix the errors in the form');
        return;
      }

      const payload = {
        name: formData.personalDetails.fullName,
        studentId: formData.studentId || generateStudentId(),
        personalDetails: {
          fullName: formData.personalDetails.fullName,
          phone: formData.personalDetails.phone,
          age: formData.personalDetails.age ? parseInt(formData.personalDetails.age) : undefined,
          email: formData.personalDetails.email
        },
        paymentPlan: {
          totalFees: formData.paymentPlan.totalFees ? parseFloat(formData.paymentPlan.totalFees) : 0,
          paidAmount: formData.paymentPlan.paidAmount ? parseFloat(formData.paymentPlan.paidAmount) : 0,
          dueDate: formData.paymentPlan.dueDate || new Date().toISOString().split('T')[0]
        }
      };

      Object.keys(payload.personalDetails).forEach(key => {
        if (payload.personalDetails[key] === undefined) delete payload.personalDetails[key];
      });

      createLeadMutation.mutate(payload);
    };

    return (
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Personal Details</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  name="personalDetails.fullName"
                  value={formData.personalDetails.fullName}
                  onChange={handleInputChange}
                  className={`form-input ${errors.fullName ? 'border-red-500' : ''}`}
                  placeholder="Enter full name"
                />
                {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Email *</label>
                <input
                  type="email"
                  name="personalDetails.email"
                  value={formData.personalDetails.email}
                  onChange={handleInputChange}
                  className={`form-input ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="Enter email address"
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  name="personalDetails.phone"
                  value={formData.personalDetails.phone}
                  onChange={handleInputChange}
                  className={`form-input ${errors.phone ? 'border-red-500' : ''}`}
                  placeholder="Enter phone number"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Age</label>
                <input
                  type="number"
                  name="personalDetails.age"
                  value={formData.personalDetails.age}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Student ID</label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleInputChange}
                  onFocus={handleStudentIdFocus}
                  className="form-input"
                  placeholder="Will be auto-generated"
                />
                <p className="text-xs text-gray-500 mt-1">Leave empty for auto-generation</p>
              </div>
            </div>
          </div>

          <div className="form-section">
            <label className="form-label">Payment Details</label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="form-group">
                <label className="form-label">Total Fees (₹)</label>
                <input
                  type="number"
                  name="paymentPlan.totalFees"
                  value={formData.paymentPlan.totalFees}
                  onChange={handleInputChange}
                  className={`form-input ${errors.totalFees ? 'border-red-500' : ''}`}
                />
                {errors.totalFees && <p className="text-red-500 text-xs mt-1">{errors.totalFees}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Paid Amount (₹)</label>
                <input
                  type="number"
                  name="paymentPlan.paidAmount"
                  value={formData.paymentPlan.paidAmount}
                  onChange={handleInputChange}
                  className={`form-input ${errors.paidAmount ? 'border-red-500' : ''}`}
                />
                {errors.paidAmount && <p className="text-red-500 text-xs mt-1">{errors.paidAmount}</p>}
              </div>

              <div className="form-group">
                <label className="form-label">Due Date</label>
                <input
                  type="date"
                  name="paymentPlan.dueDate"
                  value={formData.paymentPlan.dueDate}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={close} disabled={createLeadMutation?.isLoading}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={createLeadMutation?.isLoading}>
              {createLeadMutation?.isLoading ? 'Adding...' : 'Add Lead'}
            </button>
          </div>
        </div>
      </form>
    );
  };

  // ConvertLeadForm - original join form extracted into a component
  const ConvertLeadForm = ({ lead: l, onClose: close, onSuccess: success }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [courses, setCourses] = useState([]);
    const [batches, setBatches] = useState([]);
    const [formData, setFormData] = useState({ courseId: '', batchId: '', remarks: '', discount: 0, finalAmount: 0 });

    useEffect(() => {
      fetchCourses();
      if (l?.courseInterest) setFormData(prev => ({ ...prev, courseId: l.courseInterest }));
    }, [l]);

    useEffect(() => {
      if (formData.courseId) fetchBatches(formData.courseId);
    }, [formData.courseId]);

    const fetchCourses = async () => {
      try {
        const response = await courseService.getCourses();
        setCourses(response.data || []);
      } catch (err) {
        console.error('Error fetching courses:', err);
      }
    };

    const fetchBatches = async (courseId) => {
      try {
        const response = await courseService.getCourseBatches(courseId);
        setBatches(response.data || []);
      } catch (err) {
        console.error('Error fetching batches:', err);
      }
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);

      try {
        const enrollmentData = {
          leadId: l.id,
          studentName: l.name,
          studentEmail: l.email,
          studentPhone: l.phone,
          courseId: formData.courseId,
          batchId: formData.batchId,
          remarks: formData.remarks,
          discount: formData.discount,
          enrolledBy: user.id,
          status: 'active'
        };

        await api.post('/enrollments', enrollmentData);
        await leadService.updateLeadStatus(l.id, 'joined');
        success?.();
        close?.();
      } catch (err) {
        console.error('Error joining lead:', err);
        toast.error(err.message || 'Failed to join lead');
      } finally {
        setLoading(false);
      }
    };

    return (
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Lead Information</label>
            <div className="lead-info">
              <p><strong>Name:</strong> {l?.name}</p>
              <p><strong>Email:</strong> {l?.email}</p>
              <p><strong>Phone:</strong> {l?.phone}</p>
              <p><strong>Source:</strong> {l?.source}</p>
            </div>
          </div>

          <SelectField
            label="Select Course *"
            value={formData.courseId}
            onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
            options={[{ value: '', label: 'Select a course' }, ...courses.map(c => ({ value: c.id, label: `${c.name} - ₹${c.fee}` }))]}
            required
          />

          <SelectField
            label="Select Batch *"
            value={formData.batchId}
            onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
            options={[{ value: '', label: 'Select a batch' }, ...batches.map(b => ({ value: b.id, label: `${b.name} (${b.startDate} - ${b.endDate})` }))]}
            required
            disabled={!formData.courseId}
          />

          <InputField type="number" label="Discount (₹)" value={formData.discount} onChange={(e) => setFormData({ ...formData, discount: parseInt(e.target.value) || 0 })} min="0" />

          <div className="form-group">
            <label className="form-label">Remarks</label>
            <textarea className="form-control" value={formData.remarks} onChange={(e) => setFormData({ ...formData, remarks: e.target.value })} rows="3" placeholder="Any additional notes..." />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-outline" onClick={close} disabled={loading}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading ? 'Processing...' : 'Join Lead'}</button>
          </div>
        </div>
      </form>
    );
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose} title="" size="lg">
      <div className="modal-header">
        <div className="flex space-x-4">
          <button onClick={() => setActiveTab('add')} className={`px-4 py-2 rounded-t-lg ${activeTab === 'add' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}>
            Add New Lead
          </button>
          {lead && (
            <button onClick={() => setActiveTab('convert')} className={`px-4 py-2 rounded-t-lg ${activeTab === 'convert' ? 'bg-blue-100 text-blue-600' : 'text-gray-500'}`}>
              Convert Lead
            </button>
          )}
        </div>
      </div>

      <div className="modal-body">
        {activeTab === 'add' ? (
          <AddLeadForm onClose={onClose} onSuccess={onSuccess} />
        ) : (
          <ConvertLeadForm lead={lead} onClose={onClose} onSuccess={onSuccess} />
        )}
      </div>
    </BaseModal>
  );
};

export default JoinLeadModal;