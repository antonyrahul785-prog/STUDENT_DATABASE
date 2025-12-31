import React, { useState, useEffect } from 'react';
import BaseModal from './BaseModal';
import InputField from '../Form/InputField';
import SelectField from '../Form/SelectField';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';
import { studentService } from '../../../services/studentService';
import { paymentService } from '../../../services/paymentService';

const PaymentModal = ({ isOpen, onClose, student, onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState({
    amount: '',
    paymentMethod: 'cash',
    paymentDate: new Date().toISOString().split('T')[0],
    referenceNumber: '',
    remarks: ''
  });

  useEffect(() => {
    if (isOpen && student) {
      // Set default amount based on student's pending fee
      setPaymentData(prev => ({
        ...prev,
        amount: student.pendingFee || ''
      }));
    }
  }, [isOpen, student]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payment = {
        studentId: student.id,
        studentName: student.name,
        ...paymentData,
        collectedBy: user.id,
        status: 'completed'
      };

      await paymentService.createPayment(payment);
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error creating payment:', error);
      alert(error.message || 'Failed to create payment');
    } finally {
      setLoading(false);
    }
  };

  const paymentMethods = [
    { value: 'cash', label: 'Cash' },
    { value: 'bank_transfer', label: 'Bank Transfer' },
    { value: 'cheque', label: 'Cheque' },
    { value: 'online', label: 'Online Payment' },
    { value: 'card', label: 'Credit/Debit Card' }
  ];

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Record Payment"
      size="md"
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
            {loading ? 'Processing...' : 'Record Payment'}
          </button>
        </>
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Student Information</label>
            <div className="student-info">
              <p><strong>Name:</strong> {student?.name}</p>
              <p><strong>ID:</strong> {student?.studentId}</p>
              <p><strong>Course:</strong> {student?.course}</p>
            </div>
          </div>

          <InputField
            type="number"
            label="Amount (₹) *"
            value={paymentData.amount}
            onChange={(e) => setPaymentData({ ...paymentData, amount: e.target.value })}
            required
            min="1"
            placeholder="Enter amount"
          />

          <SelectField
            label="Payment Method *"
            value={paymentData.paymentMethod}
            onChange={(e) => setPaymentData({ ...paymentData, paymentMethod: e.target.value })}
            options={paymentMethods}
            required
          />

          <InputField
            type="date"
            label="Payment Date *"
            value={paymentData.paymentDate}
            onChange={(e) => setPaymentData({ ...paymentData, paymentDate: e.target.value })}
            required
          />

          <InputField
            type="text"
            label="Reference Number"
            value={paymentData.referenceNumber}
            onChange={(e) => setPaymentData({ ...paymentData, referenceNumber: e.target.value })}
            placeholder="Transaction ID, Cheque No., etc."
          />

          <div className="form-group">
            <label className="form-label">Remarks</label>
            <textarea
              className="form-control"
              value={paymentData.remarks}
              onChange={(e) => setPaymentData({ ...paymentData, remarks: e.target.value })}
              rows="3"
              placeholder="Any additional notes..."
            />
          </div>
        </div>
      </form>
    </BaseModal>
  );
};

export default PaymentModal;