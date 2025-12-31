import React from 'react';
import { DollarSign, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { format } from 'date-fns';

const FeeStatus = ({ fees = [], studentId, onPayNow }) => {
  const calculateSummary = () => {
    const total = fees.reduce((sum, fee) => sum + (fee.amount || 0), 0);
    const paid = fees.reduce((sum, fee) => sum + (fee.paidAmount || 0), 0);
    const pending = fees.reduce((sum, fee) => {
      if (fee.status === 'pending' || fee.status === 'overdue') {
        return sum + (fee.amount - (fee.paidAmount || 0));
      }
      return sum;
    }, 0);
    
    return { total, paid, pending, paidPercentage: total > 0 ? Math.round((paid / total) * 100) : 0 };
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'paid':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'overdue':
        return <AlertCircle size={16} className="text-red-600" />;
      case 'pending':
        return <AlertCircle size={16} className="text-yellow-600" />;
      default:
        return <AlertCircle size={16} className="text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return format(new Date(date), 'MMM dd, yyyy');
  };

  const summary = calculateSummary();

  return (
    <div className="fee-status">
      <div className="section-header">
        <h3>Fee Status</h3>
        <div className="summary-badges">
          <span className="summary-badge total">
            <DollarSign size={14} />
            Total: ${summary.total}
          </span>
          <span className="summary-badge paid">
            <CheckCircle size={14} />
            Paid: ${summary.paid}
          </span>
          <span className="summary-badge pending">
            <AlertCircle size={14} />
            Pending: ${summary.pending}
          </span>
        </div>
      </div>

      <div className="progress-section">
        <div className="progress-header">
          <span>Payment Progress</span>
          <span className="progress-percentage">{summary.paidPercentage}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${summary.paidPercentage}%` }}
          ></div>
        </div>
      </div>

      <div className="fees-list">
        {fees.length === 0 ? (
          <div className="no-fees">
            <DollarSign size={32} />
            <p>No fee records found</p>
          </div>
        ) : (
          <div className="fees-table">
            <div className="table-header">
              <div className="table-cell">Description</div>
              <div className="table-cell">Due Date</div>
              <div className="table-cell">Amount</div>
              <div className="table-cell">Paid</div>
              <div className="table-cell">Status</div>
              <div className="table-cell">Actions</div>
            </div>
            
            {fees.map((fee, index) => {
              const balance = fee.amount - (fee.paidAmount || 0);
              
              return (
                <div key={index} className="table-row">
                  <div className="table-cell">
                    <div className="fee-description">
                      {fee.description}
                      {fee.enrollment && (
                        <span className="fee-course">{fee.enrollment.course?.name}</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="table-cell">
                    <div className="due-date">
                      <Calendar size={12} />
                      {formatDate(fee.dueDate)}
                    </div>
                  </div>
                  
                  <div className="table-cell amount">${fee.amount}</div>
                  
                  <div className="table-cell">
                    <div className="paid-amount">
                      <DollarSign size={12} />
                      ${fee.paidAmount || 0}
                    </div>
                  </div>
                  
                  <div className="table-cell">
                    <div className={`status-badge ${getStatusColor(fee.status)}`}>
                      {getStatusIcon(fee.status)}
                      {fee.status}
                    </div>
                  </div>
                  
                  <div className="table-cell">
                    {balance > 0 && (
                      <button
                        onClick={() => onPayNow?.(fee)}
                        className="pay-btn"
                      >
                        Pay ${balance}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {summary.pending > 0 && (
        <div className="pending-actions">
          <button
            onClick={() => onPayNow?.()}
            className="btn btn-primary"
          >
            <DollarSign size={16} />
            Pay All Pending (${summary.pending})
          </button>
        </div>
      )}
    </div>
  );
};

export default FeeStatus;