import React, { useState, useEffect } from 'react';
import BaseModal from './BaseModal';
import InputField from '../Form/InputField';
import SelectField from '../Form/SelectField';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';
import { leadService } from '../../../services/leadService';
import { courseService } from '../../../services/courseService';

const JoinLeadModal = ({ isOpen, onClose, lead, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [batches, setBatches] = useState([]);
  const [formData, setFormData] = useState({
    courseId: '',
    batchId: '',
    remarks: '',
    discount: 0,
    finalAmount: 0
  });

  useEffect(() => {
    if (isOpen) {
      fetchCourses();
      if (lead?.courseInterest) {
        setFormData(prev => ({ ...prev, courseId: lead.courseInterest }));
      }
    }
  }, [isOpen, lead]);

  useEffect(() => {
    if (formData.courseId) {
      fetchBatches(formData.courseId);
    }
  }, [formData.courseId]);

  const fetchCourses = async () => {
    try {
      const response = await courseService.getCourses();
      setCourses(response.data || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchBatches = async (courseId) => {
    try {
      const response = await courseService.getCourseBatches(courseId);
      setBatches(response.data || []);
    } catch (error) {
      console.error('Error fetching batches:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const enrollmentData = {
        leadId: lead.id,
        studentName: lead.name,
        studentEmail: lead.email,
        studentPhone: lead.phone,
        courseId: formData.courseId,
        batchId: formData.batchId,
        remarks: formData.remarks,
        discount: formData.discount,
        enrolledBy: user.id,
        status: 'active'
      };

      await api.post('/enrollments', enrollmentData);
      
      // Update lead status to 'joined'
      await leadService.updateLeadStatus(lead.id, 'joined');
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error joining lead:', error);
      alert(error.message || 'Failed to join lead');
    } finally {
      setLoading(false);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Join Lead"
      size="lg"
      footer={
        <>
          <button 
            className="btn btn-outline" 
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            className="btn btn-primary" 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Join Lead'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Lead Information</label>
            <div className="lead-info">
              <p><strong>Name:</strong> {lead?.name}</p>
              <p><strong>Email:</strong> {lead?.email}</p>
              <p><strong>Phone:</strong> {lead?.phone}</p>
              <p><strong>Source:</strong> {lead?.source}</p>
            </div>
          </div>

          <SelectField
            label="Select Course *"
            value={formData.courseId}
            onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
            options={[
              { value: '', label: 'Select a course' },
              ...courses.map(course => ({
                value: course.id,
                label: `${course.name} - ₹${course.fee}`
              }))
            ]}
            required
          />

          <SelectField
            label="Select Batch *"
            value={formData.batchId}
            onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
            options={[
              { value: '', label: 'Select a batch' },
              ...batches.map(batch => ({
                value: batch.id,
                label: `${batch.name} (${batch.startDate} - ${batch.endDate})`
              }))
            ]}
            required
            disabled={!formData.courseId}
          />

          <InputField
            type="number"
            label="Discount (₹)"
            value={formData.discount}
            onChange={(e) => setFormData({ ...formData, discount: parseInt(e.target.value) || 0 })}
            min="0"
          />

          <div className="form-group">
            <label className="form-label">Remarks</label>
            <textarea
              className="form-control"
              value={formData.remarks}
              onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
              rows="3"
              placeholder="Any additional notes..."
            />
          </div>
        </div>
      </form>
    </BaseModal>
  );
};

export default JoinLeadModal;