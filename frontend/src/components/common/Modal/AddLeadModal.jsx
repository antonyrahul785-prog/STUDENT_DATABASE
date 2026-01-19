// src/components/common/Modal/AddLeadModal.jsx
import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { leadService } from '../../../services/leadService';
import toast from 'react-hot-toast';
import './Modal.css';

const AddLeadModal = ({ onClose, onSuccess }) => {
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

  // Generate student ID automatically
  const generateStudentId = () => {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    return `STU-${year}-${randomNum}`;
  };

  // Mutation for creating lead
  const createLeadMutation = useMutation({
    mutationFn: (leadData) => leadService.createLead(leadData),
    onSuccess: (data) => {
      toast.success('Lead added successfully!');
      queryClient.invalidateQueries(['leads']);
      queryClient.invalidateQueries(['leadStats']);
      onSuccess();
      onClose();
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to add lead');
      console.error('Create lead error:', error);
    }
  });

  // Handle form input changes
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
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate form
    const validationErrors = {};
    
    if (!formData.personalDetails.fullName.trim()) {
      validationErrors.fullName = 'Full name is required';
    }
    
    if (!formData.personalDetails.email.trim()) {
      validationErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.personalDetails.email)) {
      validationErrors.email = 'Email is invalid';
    }
    
    if (!formData.personalDetails.phone.trim()) {
      validationErrors.phone = 'Phone number is required';
    }
    
    if (formData.paymentPlan.totalFees && isNaN(formData.paymentPlan.totalFees)) {
      validationErrors.totalFees = 'Total fees must be a number';
    }
    
    if (formData.paymentPlan.paidAmount && isNaN(formData.paymentPlan.paidAmount)) {
      validationErrors.paidAmount = 'Paid amount must be a number';
    }
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fix the errors in the form');
      return;
    }
    
    // Prepare payload
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
    
    // Remove undefined fields
    Object.keys(payload.personalDetails).forEach(key => {
      if (payload.personalDetails[key] === undefined) {
        delete payload.personalDetails[key];
      }
    });
    
    // Create lead
    createLeadMutation.mutate(payload);
  };

  // Auto-generate student ID on focus
  const handleStudentIdFocus = () => {
    if (!formData.studentId) {
      setFormData(prev => ({
        ...prev,
        studentId: generateStudentId()
      }));
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2 className="modal-title">Add New Lead</h2>
          <button
            onClick={onClose}
            className="modal-close-btn"
            disabled={createLeadMutation.isLoading}
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="modal-content">
            {/* Personal Details Section */}
            <div className="form-section">
              <h3 className="section-title">Personal Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="form-group">
                  <label htmlFor="personalDetails.fullName" className="form-label">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="personalDetails.fullName"
                    name="personalDetails.fullName"
                    value={formData.personalDetails.fullName}
                    onChange={handleInputChange}
                    className={`form-input ${errors.fullName ? 'border-red-500' : ''}`}
                    placeholder="Enter full name"
                    required
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="personalDetails.email" className="form-label">
                    Email *
                  </label>
                  <input
                    type="email"
                    id="personalDetails.email"
                    name="personalDetails.email"
                    value={formData.personalDetails.email}
                    onChange={handleInputChange}
                    className={`form-input ${errors.email ? 'border-red-500' : ''}`}
                    placeholder="Enter email address"
                    required
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="personalDetails.phone" className="form-label">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="personalDetails.phone"
                    name="personalDetails.phone"
                    value={formData.personalDetails.phone}
                    onChange={handleInputChange}
                    className={`form-input ${errors.phone ? 'border-red-500' : ''}`}
                    placeholder="+91 1234567890"
                    required
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="personalDetails.age" className="form-label">
                    Age
                  </label>
                  <input
                    type="number"
                    id="personalDetails.age"
                    name="personalDetails.age"
                    value={formData.personalDetails.age}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="Enter age"
                    min="1"
                    max="100"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="studentId" className="form-label">
                    Student ID
                  </label>
                  <input
                    type="text"
                    id="studentId"
                    name="studentId"
                    value={formData.studentId}
                    onChange={handleInputChange}
                    onFocus={handleStudentIdFocus}
                    className="form-input"
                    placeholder="Will be auto-generated"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Leave empty for auto-generation
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Details Section */}
            <div className="form-section">
              <h3 className="section-title">Payment Details</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="form-group">
                  <label htmlFor="paymentPlan.totalFees" className="form-label">
                    Total Fees (₹)
                  </label>
                  <input
                    type="number"
                    id="paymentPlan.totalFees"
                    name="paymentPlan.totalFees"
                    value={formData.paymentPlan.totalFees}
                    onChange={handleInputChange}
                    className={`form-input ${errors.totalFees ? 'border-red-500' : ''}`}
                    placeholder="5000"
                    min="0"
                    step="100"
                  />
                  {errors.totalFees && (
                    <p className="text-red-500 text-xs mt-1">{errors.totalFees}</p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="paymentPlan.paidAmount" className="form-label">
                    Paid Amount (₹)
                  </label>
                  <input
                    type="number"
                    id="paymentPlan.paidAmount"
                    name="paymentPlan.paidAmount"
                    value={formData.paymentPlan.paidAmount}
                    onChange={handleInputChange}
                    className={`form-input ${errors.paidAmount ? 'border-red-500' : ''}`}
                    placeholder="400"
                    min="0"
                    step="100"
                  />
                  {errors.paidAmount && (
                    <p className="text-red-500 text-xs mt-1">{errors.paidAmount}</p>
                  )}
                </div>

                <div className="form-group">
                  <label htmlFor="paymentPlan.dueDate" className="form-label">
                    Due Date
                  </label>
                  <input
                    type="date"
                    id="paymentPlan.dueDate"
                    name="paymentPlan.dueDate"
                    value={formData.paymentPlan.dueDate}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={createLeadMutation.isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={createLeadMutation.isLoading}
            >
              {createLeadMutation.isLoading ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                  Adding...
                </>
              ) : (
                'Add Lead'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLeadModal;