import React from 'react';
import { 
  DollarSign, Calendar, User, 
  CreditCard, CheckCircle, AlertCircle 
} from 'lucide-react';
import { format } from 'date-fns';

const PaymentCard = ({ 
  payment, 
  onView, 
  onEdit, 
  onDelete,
  onGenerateReceipt,
  onRefund 
}) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'pending':
        return <AlertCircle size={16} className="text-yellow-600" />;
      case 'failed':
        return <AlertCircle size={16} className="text-red-600" />;
      case 'refunded':
        return <CheckCircle size={16} className="text-blue-600" />;
      default:
        return <AlertCircle size={16} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getMethodIcon = (method) => {
    switch (method) {
      case 'cash':
        return <DollarSign size={14} />;
      case 'card':
        return <CreditCard size={14} />;
      case 'bank_transfer':
        return '🏦';
      case 'upi':
        return '📱';
      case 'cheque':
        return '📄';
      default:
        return <DollarSign size={14} />;
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return format(new Date(date), 'MMM dd, yyyy HH:mm');
  };

  return (
    <div className="payment-card">
      <div className="payment-header">
        <div className="payment-id">
          <h4>Payment #{payment.referenceNumber}</h4>
          <span className="payment-date">
            <Calendar size={12} />
            {formatDate(payment.paymentDate)}
          </span>
        </div>
        
        <div className="payment-status">
          <span className={`status-badge ${getStatusColor(payment.status)}`}>
            {getStatusIcon(payment.status)}
            {payment.status}
          </span>
        </div>
      </div>
      
      <div className="payment-content">
        <div className="payment-info">
          <div className="info-item">
            <User size={14} />
            <div>
              <span className="info-label">Student</span>
              <span className="info-value">{payment.student?.user?.name}</span>
            </div>
          </div>
          
          <div className="info-item">
            <DollarSign size={14} />
            <div>
              <span className="info-label">Amount</span>
              <span className="info-value">${payment.amount}</span>
            </div>
          </div>
          
          <div className="info-item">
            {getMethodIcon(payment.paymentMethod)}
            <div>
              <span className="info-label">Method</span>
              <span className="info-value">
                {payment.paymentMethod?.replace('_', ' ')?.toUpperCase()}
              </span>
            </div>
          </div>
          
          {payment.enrollment && (
            <div className="info-item">
              <span className="info-label">Course</span>
              <span className="info-value">{payment.enrollment.course?.name}</span>
            </div>
          )}
        </div>
        
        {payment.notes && (
          <div className="payment-notes">
            <p>{payment.notes}</p>
          </div>
        )}
      </div>
      
      <div className="payment-footer">
        <div className="payment-actions">
          <button onClick={() => onView(payment)} className="btn btn-sm">
            View Details
          </button>
          
          {payment.status === 'completed' && (
            <button 
              onClick={() => onGenerateReceipt(payment)} 
              className="btn btn-sm btn-secondary"
            >
              Receipt
            </button>
          )}
          
          {payment.status === 'pending' && (
            <>
              <button onClick={() => onEdit(payment)} className="btn btn-sm btn-primary">
                Mark Paid
              </button>
              <button onClick={() => onDelete(payment)} className="btn btn-sm btn-danger">
                Cancel
              </button>
            </>
          )}
          
          {payment.status === 'completed' && !payment.isRefunded && (
            <button onClick={() => onRefund(payment)} className="btn btn-sm btn-danger">
              Refund
            </button>
          )}
        </div>
        
        {payment.transactionId && (
          <div className="transaction-id">
            Transaction: {payment.transactionId}
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentCard;