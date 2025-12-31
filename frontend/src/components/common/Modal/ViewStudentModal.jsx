import React, { useState, useEffect } from 'react';
import BaseModal from './BaseModal';
import useAuth from '../../../hooks/useAuth';
import { studentService } from '../../../services/studentService';
// Remove this line: import './FeeSummary.css';
// ... rest of the component

const ViewStudentModal = ({ isOpen, onClose, studentId }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    if (isOpen && studentId) {
      fetchStudentDetails();
    }
  }, [isOpen, studentId]);

  const fetchStudentDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch student details
      const studentData = await studentService.getStudentById(studentId);
      setStudent(studentData.data || studentData);
      
      // Fetch enrollments
      const enrollmentsData = await studentService.getStudentEnrollments(studentId);
      setEnrollments(enrollmentsData.data || enrollmentsData);
      
      // Fetch payments
      const paymentsData = await studentService.getStudentPayments(studentId);
      setPayments(paymentsData.data || paymentsData);
      
    } catch (error) {
      console.error('Error fetching student details:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN');
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <BaseModal isOpen={isOpen} onClose={onClose} title="Student Details" size="lg">
        <div className="loading">
          <div className="loading-spinner"></div>
        </div>
      </BaseModal>
    );
  }

  if (!student) {
    return (
      <BaseModal isOpen={isOpen} onClose={onClose} title="Student Details" size="lg">
        <div className="empty-state">
          <p>Student not found</p>
        </div>
      </BaseModal>
    );
  }

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Student Details"
      size="xl"
    >
      <div className="student-details">
        <div className="student-profile">
          <div className="profile-header">
            <div className="avatar">
              {student.name?.charAt(0) || 'S'}
            </div>
            <div className="profile-info">
              <h3 className="student-name">{student.name}</h3>
              <p className="student-id">ID: {student.studentId || 'N/A'}</p>
              <p className="student-email">{student.email}</p>
              <p className="student-phone">{student.phone}</p>
            </div>
          </div>

          <div className="profile-details">
            <div className="detail-row">
              <span className="detail-label">Date of Birth:</span>
              <span className="detail-value">{formatDate(student.dateOfBirth)}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Gender:</span>
              <span className="detail-value">{student.gender || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Address:</span>
              <span className="detail-value">{student.address || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">City:</span>
              <span className="detail-value">{student.city || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">State:</span>
              <span className="detail-value">{student.state || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Pincode:</span>
              <span className="detail-value">{student.pincode || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Parent Name:</span>
              <span className="detail-value">{student.parentName || 'N/A'}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Parent Phone:</span>
              <span className="detail-value">{student.parentPhone || 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="student-enrollments">
          <h4>Enrollments</h4>
          {enrollments.length === 0 ? (
            <p className="no-data">No enrollments found</p>
          ) : (
            <div className="enrollment-list">
              {enrollments.map(enrollment => (
                <div key={enrollment.id} className="enrollment-item">
                  <div className="enrollment-course">{enrollment.courseName}</div>
                  <div className="enrollment-batch">{enrollment.batchName}</div>
                  <div className="enrollment-status">{enrollment.status}</div>
                  <div className="enrollment-date">
                    Enrolled: {formatDate(enrollment.enrollmentDate)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="student-payments">
          <h4>Payment History</h4>
          {payments.length === 0 ? (
            <p className="no-data">No payments found</p>
          ) : (
            <div className="payment-list">
              {payments.map(payment => (
                <div key={payment.id} className="payment-item">
                  <div className="payment-amount">{formatCurrency(payment.amount)}</div>
                  <div className="payment-method">{payment.paymentMethod}</div>
                  <div className="payment-date">{formatDate(payment.paymentDate)}</div>
                  <div className={`payment-status status-${payment.status}`}>
                    {payment.status}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </BaseModal>
  );
};

export default ViewStudentModal;