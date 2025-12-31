import React, { useState, useEffect, useMemo } from 'react';
import { PieChart, BarChart } from '../common/Charts';
import { 
  DownloadIcon, 
  PrintIcon, 
  ShareIcon, 
  CalendarIcon,
  MoneyIcon,
  ReceiptIcon,
  AlertIcon,
  CheckCircleIcon,
  ClockIcon,
  InfoIcon 
} from '../../utils/icons';
import { paymentService } from '../../services/paymentService';
import { formatCurrency, formatDate } from '../../utils/formatters';
import './../../../styles/components/feesummary.css';

const FeeSummary = ({ 
  studentId, 
  courseId, 
  enrollmentId,
  showActions = true,
  onPaymentRequest,
  onReceiptDownload,
  onPrint,
  onShare,
  compact = false
}) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [summary, setSummary] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [upcomingPayments, setUpcomingPayments] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('monthly');
  const [chartData, setChartData] = useState(null);
  const [selectedInstallment, setSelectedInstallment] = useState(null);
  const [showDetailedView, setShowDetailedView] = useState(false);

  useEffect(() => {
    if (studentId || enrollmentId) {
      fetchFeeSummary();
    }
  }, [studentId, courseId, enrollmentId, selectedPeriod]);

  const fetchFeeSummary = async () => {
    try {
      setLoading(true);
      setError(null);

      const [summaryData, historyData, upcomingData] = await Promise.all([
        paymentService.getFeeSummary({ 
          studentId, 
          courseId, 
          enrollmentId 
        }),
        paymentService.getPaymentHistory({ 
          studentId, 
          courseId, 
          enrollmentId 
        }),
        paymentService.getUpcomingPayments({ 
          studentId, 
          courseId, 
          enrollmentId 
        })
      ]);

      setSummary(summaryData);
      setPaymentHistory(historyData);
      setUpcomingPayments(upcomingData);

      // Prepare chart data
      prepareChartData(summaryData);
    } catch (err) {
      setError('Failed to load fee summary. Please try again.');
      console.error('Error fetching fee summary:', err);
    } finally {
      setLoading(false);
    }
  };

  const prepareChartData = (summaryData) => {
    if (!summaryData) return;

    const chartData = {
      paidVsDue: {
        labels: ['Paid', 'Due'],
        datasets: [
          {
            data: [summaryData.paidAmount, summaryData.dueAmount],
            backgroundColor: ['#10B981', '#EF4444'],
            borderWidth: 0,
          }
        ]
      },
      paymentTrends: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [
          {
            label: 'Payments Received',
            data: Array(12).fill(0).map(() => Math.floor(Math.random() * 50000) + 10000),
            backgroundColor: '#3B82F6',
            borderColor: '#2563EB',
            borderWidth: 2,
            tension: 0.4,
            fill: true,
          }
        ]
      }
    };

    setChartData(chartData);
  };

  const handleMakePayment = (installment = null) => {
    if (onPaymentRequest) {
      onPaymentRequest(installment);
    } else {
      // Default payment modal trigger
      console.log('Payment requested for:', installment);
    }
  };

  const handleDownloadReceipt = (paymentId) => {
    if (onReceiptDownload) {
      onReceiptDownload(paymentId);
    } else {
      paymentService.downloadReceipt(paymentId);
    }
  };

  const handlePrint = () => {
    if (onPrint) {
      onPrint();
    } else {
      window.print();
    }
  };

  const handleShare = () => {
    if (onShare) {
      onShare();
    } else {
      // Default share functionality
      if (navigator.share) {
        navigator.share({
          title: 'Fee Summary',
          text: `Fee Summary - Total: ${formatCurrency(summary?.totalFees)}, Paid: ${formatCurrency(summary?.paidAmount)}, Due: ${formatCurrency(summary?.dueAmount)}`,
          url: window.location.href,
        });
      }
    }
  };

  const calculateProgress = () => {
    if (!summary) return 0;
    return Math.round((summary.paidAmount / summary.totalFees) * 100);
  };

  const getPaymentStatusColor = (status) => {
    const colors = {
      paid: 'success',
      pending: 'warning',
      overdue: 'danger',
      partial: 'info',
      scheduled: 'secondary'
    };
    return colors[status] || 'secondary';
  };

  const getPaymentMethodIcon = (method) => {
    const icons = {
      cash: '💰',
      card: '💳',
      upi: '📱',
      netbanking: '🏦',
      cheque: '📄',
      others: '📝'
    };
    return icons[method] || '💰';
  };

  const calculateDueDateStatus = (dueDate) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due - today) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { status: 'overdue', days: Math.abs(diffDays) };
    if (diffDays <= 7) return { status: 'soon', days: diffDays };
    return { status: 'upcoming', days: diffDays };
  };

  const totalOverdue = useMemo(() => {
    if (!upcomingPayments) return 0;
    return upcomingPayments.reduce((total, payment) => {
      const status = calculateDueDateStatus(payment.dueDate);
      return status.status === 'overdue' ? total + payment.amount : total;
    }, 0);
  }, [upcomingPayments]);

  if (loading) {
    return (
      <div className="fee-summary-loading">
        <div className="loading-spinner"></div>
        <p>Loading fee summary...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fee-summary-error">
        <AlertIcon />
        <p>{error}</p>
        <button 
          className="btn-retry"
          onClick={fetchFeeSummary}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="fee-summary-empty">
        <InfoIcon />
        <p>No fee data available</p>
      </div>
    );
  }

  // Compact View
  if (compact) {
    return (
      <div className="fee-summary-compact">
        <div className="compact-header">
          <h4>Fee Summary</h4>
          <span className={`status-badge status-${summary.paymentStatus}`}>
            {summary.paymentStatus}
          </span>
        </div>
        
        <div className="compact-stats">
          <div className="compact-stat">
            <span className="stat-label">Total</span>
            <span className="stat-value">{formatCurrency(summary.totalFees)}</span>
          </div>
          <div className="compact-stat">
            <span className="stat-label">Paid</span>
            <span className="stat-value paid">{formatCurrency(summary.paidAmount)}</span>
          </div>
          <div className="compact-stat">
            <span className="stat-label">Due</span>
            <span className="stat-value due">{formatCurrency(summary.dueAmount)}</span>
          </div>
        </div>
        
        <div className="progress-bar-compact">
          <div 
            className="progress-fill"
            style={{ width: `${calculateProgress()}%` }}
          ></div>
        </div>
        
        <button 
          className="btn-view-details"
          onClick={() => setShowDetailedView(true)}
        >
          View Details
        </button>
      </div>
    );
  }

  // Full View
  return (
    <div className="fee-summary">
      {/* Header with Actions */}
      <div className="summary-header">
        <div className="header-left">
          <h2>Fee Summary</h2>
          <div className="summary-tags">
            <span className={`status-tag status-${summary.paymentStatus}`}>
              {summary.paymentStatus.toUpperCase()}
            </span>
            <span className="enrollment-tag">
              Enrollment: {summary.enrollmentId}
            </span>
            {totalOverdue > 0 && (
              <span className="overdue-tag">
                <AlertIcon /> Overdue: {formatCurrency(totalOverdue)}
              </span>
            )}
          </div>
        </div>
        
        {showActions && (
          <div className="header-actions">
            <button 
              className="btn-action"
              onClick={() => handleMakePayment()}
              disabled={summary.dueAmount <= 0}
            >
              <MoneyIcon />
              <span>Make Payment</span>
            </button>
            
            <button 
              className="btn-action"
              onClick={handlePrint}
            >
              <PrintIcon />
              <span>Print</span>
            </button>
            
            <button 
              className="btn-action"
              onClick={() => handleDownloadReceipt('all')}
              disabled={paymentHistory.length === 0}
            >
              <DownloadIcon />
              <span>Download All</span>
            </button>
            
            <button 
              className="btn-action"
              onClick={handleShare}
            >
              <ShareIcon />
              <span>Share</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card total-card">
          <div className="card-icon">
            <ReceiptIcon />
          </div>
          <div className="card-content">
            <h3>Total Fees</h3>
            <p className="card-amount">{formatCurrency(summary.totalFees)}</p>
            <p className="card-desc">{summary.courseName || 'Course Fee'}</p>
          </div>
        </div>

        <div className="summary-card paid-card">
          <div className="card-icon">
            <CheckCircleIcon />
          </div>
          <div className="card-content">
            <h3>Amount Paid</h3>
            <p className="card-amount">{formatCurrency(summary.paidAmount)}</p>
            <div className="progress-container">
              <div className="progress-bar">
                <div 
                  className="progress-fill"
                  style={{ width: `${calculateProgress()}%` }}
                ></div>
              </div>
              <span className="progress-text">{calculateProgress()}% Paid</span>
            </div>
          </div>
        </div>

        <div className="summary-card due-card">
          <div className="card-icon">
            <AlertIcon />
          </div>
          <div className="card-content">
            <h3>Amount Due</h3>
            <p className="card-amount">{formatCurrency(summary.dueAmount)}</p>
            <p className="card-desc">
              {summary.dueAmount > 0 ? 'Payment pending' : 'All payments cleared'}
            </p>
            {summary.dueAmount > 0 && (
              <button 
                className="btn-pay-now"
                onClick={() => handleMakePayment()}
              >
                Pay Now
              </button>
            )}
          </div>
        </div>

        <div className="summary-card upcoming-card">
          <div className="card-icon">
            <CalendarIcon />
          </div>
          <div className="card-content">
            <h3>Upcoming</h3>
            <p className="card-amount">
              {formatCurrency(upcomingPayments[0]?.amount || 0)}
            </p>
            <p className="card-desc">
              Due {upcomingPayments[0] ? 
                formatDate(upcomingPayments[0].dueDate) : 
                'No upcoming payments'}
            </p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-container pie-chart">
          <h3>Payment Distribution</h3>
          {chartData && (
            <PieChart 
              data={chartData.paidVsDue}
              options={{
                plugins: {
                  legend: { position: 'bottom' },
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const value = context.raw;
                        const percentage = ((value / summary.totalFees) * 100).toFixed(1);
                        return `${context.label}: ${formatCurrency(value)} (${percentage}%)`;
                      }
                    }
                  }
                }
              }}
            />
          )}
        </div>

        <div className="chart-container bar-chart">
          <h3>Payment Trends</h3>
          <div className="chart-period-selector">
            <button 
              className={`period-btn ${selectedPeriod === 'monthly' ? 'active' : ''}`}
              onClick={() => setSelectedPeriod('monthly')}
            >
              Monthly
            </button>
            <button 
              className={`period-btn ${selectedPeriod === 'quarterly' ? 'active' : ''}`}
              onClick={() => setSelectedPeriod('quarterly')}
            >
              Quarterly
            </button>
            <button 
              className={`period-btn ${selectedPeriod === 'yearly' ? 'active' : ''}`}
              onClick={() => setSelectedPeriod('yearly')}
            >
              Yearly
            </button>
          </div>
          {chartData && (
            <BarChart 
              data={chartData.paymentTrends}
              options={{
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => formatCurrency(value)
                    }
                  }
                },
                plugins: {
                  tooltip: {
                    callbacks: {
                      label: (context) => formatCurrency(context.raw)
                    }
                  }
                }
              }}
            />
          )}
        </div>
      </div>

      {/* Payment History */}
      <div className="payment-history-section">
        <div className="section-header">
          <h3>Payment History</h3>
          <span className="history-count">
            {paymentHistory.length} payment(s)
          </span>
        </div>
        
        {paymentHistory.length > 0 ? (
          <div className="history-table">
            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Transaction ID</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th>Receipt</th>
                </tr>
              </thead>
              <tbody>
                {paymentHistory.map((payment) => (
                  <tr key={payment.id}>
                    <td>
                      <div className="date-cell">
                        <span className="date">{formatDate(payment.date, 'DD MMM')}</span>
                        <span className="year">{formatDate(payment.date, 'YYYY')}</span>
                      </div>
                    </td>
                    <td>
                      <code className="transaction-id">{payment.transactionId}</code>
                    </td>
                    <td className="amount-cell">
                      <span className="amount">{formatCurrency(payment.amount)}</span>
                    </td>
                    <td>
                      <div className="payment-method">
                        <span className="method-icon">
                          {getPaymentMethodIcon(payment.method)}
                        </span>
                        <span className="method-name">{payment.method}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge status-${payment.status}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn-receipt"
                        onClick={() => handleDownloadReceipt(payment.id)}
                        title="Download Receipt"
                      >
                        <DownloadIcon />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="no-payments">
            <p>No payment history available</p>
          </div>
        )}
      </div>

      {/* Upcoming Payments */}
      {upcomingPayments.length > 0 && (
        <div className="upcoming-payments-section">
          <div className="section-header">
            <h3>Upcoming Payments</h3>
            <span className="upcoming-count">
              {upcomingPayments.length} installment(s) remaining
            </span>
          </div>
          
          <div className="installments-grid">
            {upcomingPayments.map((installment, index) => {
              const dueStatus = calculateDueDateStatus(installment.dueDate);
              
              return (
                <div 
                  key={installment.id}
                  className={`installment-card ${dueStatus.status}`}
                  onClick={() => setSelectedInstallment(installment)}
                >
                  <div className="installment-header">
                    <h4>Installment {index + 1}</h4>
                    <span className={`due-status ${dueStatus.status}`}>
                      {dueStatus.status === 'overdue' ? 'Overdue' : 
                       dueStatus.status === 'soon' ? 'Due Soon' : 'Upcoming'}
                    </span>
                  </div>
                  
                  <div className="installment-details">
                    <div className="detail">
                      <span className="label">Amount:</span>
                      <span className="value">{formatCurrency(installment.amount)}</span>
                    </div>
                    <div className="detail">
                      <span className="label">Due Date:</span>
                      <span className="value">{formatDate(installment.dueDate)}</span>
                    </div>
                    <div className="detail">
                      <span className="label">Status:</span>
                      <span className="value">
                        {dueStatus.days > 0 ? 
                          `${dueStatus.days} days remaining` : 
                          `${Math.abs(dueStatus.days)} days overdue`}
                      </span>
                    </div>
                  </div>
                  
                  <button 
                    className="btn-pay-installment"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMakePayment(installment);
                    }}
                  >
                    Pay Now
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Payment Summary Details */}
      <div className="summary-details">
        <div className="details-card">
          <h4>Payment Details</h4>
          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">Course Fee:</span>
              <span className="detail-value">
                {formatCurrency(summary.baseFee || summary.totalFees)}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Tax ({summary.taxRate || 18}%):</span>
              <span className="detail-value">
                {formatCurrency(summary.taxAmount || 0)}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Discount:</span>
              <span className="detail-value discount">
                -{formatCurrency(summary.discountAmount || 0)}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Late Fees:</span>
              <span className="detail-value late-fee">
                +{formatCurrency(summary.lateFee || 0)}
              </span>
            </div>
            <div className="detail-item total-item">
              <span className="detail-label">Total Amount:</span>
              <span className="detail-value total-amount">
                {formatCurrency(summary.totalFees)}
              </span>
            </div>
          </div>
        </div>

        <div className="notes-card">
          <h4>Notes & Instructions</h4>
          <ul className="notes-list">
            <li>Payments are due on the 1st of every month</li>
            <li>Late payments incur a 2% monthly penalty</li>
            <li>Receipts will be generated automatically upon payment</li>
            <li>For payment-related queries, contact accounts@edumanage.com</li>
          </ul>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="summary-footer">
        <div className="footer-info">
          <p className="last-updated">
            Last updated: {summary.lastUpdated ? 
              formatDate(summary.lastUpdated, 'DD MMM YYYY, hh:mm A') : 
              formatDate(new Date(), 'DD MMM YYYY, hh:mm A')}
          </p>
          <p className="payment-terms">
            Payment Terms: {summary.paymentTerms || 'Net 30 days'}
          </p>
        </div>
        
        <div className="footer-actions">
          <button className="btn-secondary">
            <ClockIcon />
            Schedule Payment
          </button>
          <button 
            className="btn-primary"
            onClick={() => handleMakePayment()}
            disabled={summary.dueAmount <= 0}
          >
            <MoneyIcon />
            Make Payment
          </button>
        </div>
      </div>

      {/* Installment Detail Modal */}
      {selectedInstallment && (
        <div className="modal-overlay">
          <div className="installment-modal">
            <div className="modal-header">
              <h3>Installment Details</h3>
              <button 
                className="modal-close"
                onClick={() => setSelectedInstallment(null)}
              >
                &times;
              </button>
            </div>
            <div className="modal-content">
              {/* Installment detail content */}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeSummary;