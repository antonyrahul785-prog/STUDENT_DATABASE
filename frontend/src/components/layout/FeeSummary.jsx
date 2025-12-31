import React, { useState, useEffect } from 'react';
import './FeeSummary.css';
import { paymentService } from '../../services/paymentService';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { 
  AlertIcon, 
  InfoIcon, 
  MoneyIcon, 
  PrintIcon, 
  DownloadIcon, 
  ShareIcon,
  ReceiptIcon,
  CheckCircleIcon,
  CalendarIcon,
  ClockIcon
} from '../../utils/icons';


const FeeSummary = ({ studentId }) => {
  const [feeSummary, setFeeSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (studentId) {
      fetchFeeSummary();
    }
  }, [studentId]);

  const fetchFeeSummary = async () => {
    try {
      setLoading(true);
      // This would be an API call in a real app
      // const data = await paymentService.getFeeSummary(studentId);
      
      // Mock data
      setTimeout(() => {
        setFeeSummary({
          totalFee: 50000,
          paidAmount: 30000,
          pendingAmount: 20000,
          overdueAmount: 5000,
          paymentHistory: [
            { id: 1, date: '2024-01-15', amount: 15000, method: 'Bank Transfer', status: 'paid' },
            { id: 2, date: '2024-02-15', amount: 10000, method: 'Cash', status: 'paid' },
            { id: 3, date: '2024-03-15', amount: 5000, method: 'Online', status: 'pending' },
            { id: 4, date: '2024-01-30', amount: 10000, method: 'Cheque', status: 'overdue' },
          ],
          upcomingPayments: [
            { id: 1, dueDate: '2024-04-15', amount: 10000 },
            { id: 2, dueDate: '2024-05-15', amount: 10000 },
          ]
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching fee summary:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="fee-summary">
        <div className="loading">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  if (!feeSummary) {
    return (
      <div className="fee-summary">
        <div className="empty-state">
          <AlertIcon className="empty-state-icon" />
          <h3 className="empty-state-title">No Fee Data</h3>
          <p>No fee information available for this student.</p>
        </div>
      </div>
    );
  }

  const { totalFee, paidAmount, pendingAmount, overdueAmount, paymentHistory, upcomingPayments } = feeSummary;
  const paidPercentage = (paidAmount / totalFee) * 100;

  return (
    <div className="fee-summary">
      <div className="summary-header">
        <h2 className="summary-title">Fee Summary</h2>
        <div className="summary-actions">
          <button className="btn btn-outline">
            <PrintIcon className="h-4 w-4" />
            Print
          </button>
          <button className="btn btn-outline">
            <DownloadIcon className="h-4 w-4" />
            Download
          </button>
        </div>
      </div>

      <div className="summary-stats">
        <div className="stat-item">
          <div className="stat-label">Total Fee</div>
          <div className="stat-value">{formatCurrency(totalFee)}</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-label">Paid Amount</div>
          <div className="stat-value paid">{formatCurrency(paidAmount)}</div>
          <div className="stat-percentage">{paidPercentage.toFixed(1)}%</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-label">Pending Amount</div>
          <div className="stat-value pending">{formatCurrency(pendingAmount)}</div>
        </div>
        
        <div className="stat-item">
          <div className="stat-label">Overdue Amount</div>
          <div className="stat-value overdue">{formatCurrency(overdueAmount)}</div>
        </div>
      </div>

      <div className="payment-history">
        <h3 className="history-title">Payment History</h3>
        {paymentHistory.length === 0 ? (
          <div className="empty-history">
            <InfoIcon className="h-6 w-6" />
            <p>No payment history available</p>
          </div>
        ) : (
          <div className="payment-list">
            {paymentHistory.map(payment => (
              <div key={payment.id} className="payment-item">
                <div className="payment-info">
                  <div className="payment-date">{formatDate(payment.date)}</div>
                  <div className="payment-method">{payment.method}</div>
                </div>
                <div className="payment-right">
                  <div className="payment-amount">{formatCurrency(payment.amount)}</div>
                  <div className={`payment-status status-${payment.status}`}>
                    {payment.status}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {upcomingPayments.length > 0 && (
        <div className="upcoming-payments">
          <h3 className="history-title">Upcoming Payments</h3>
          <div className="upcoming-list">
            {upcomingPayments.map(payment => (
              <div key={payment.id} className="upcoming-item">
                <CalendarIcon className="h-5 w-5" />
                <div className="upcoming-info">
                  <div className="upcoming-date">{formatDate(payment.dueDate)}</div>
                  <div className="upcoming-amount">{formatCurrency(payment.amount)}</div>
                </div>
                <button className="btn btn-sm btn-primary">
                  Pay Now
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeSummary;