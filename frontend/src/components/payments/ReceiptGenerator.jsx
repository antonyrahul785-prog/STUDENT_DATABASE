import React from 'react';
import { 
  DollarSign, TrendingUp, TrendingDown, 
  Calendar, CheckCircle, AlertCircle 
} from 'lucide-react';
import { format } from 'date-fns';

const FeeSummary = ({ 
  summary, 
  recentPayments = [],
  onViewDetails,
  onGenerateReport 
}) => {
  const {
    totalRevenue = 0,
    monthlyRevenue = 0,
    pendingPayments = 0,
    completedPayments = 0,
    pendingAmount = 0,
    revenueTrend = 0,
    pendingTrend = 0,
    revenueByMonth = [],
    paymentMethods = [],
  } = summary;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return format(new Date(date), 'MMM dd, yyyy');
  };

  const getTrendIcon = (trend) => {
    if (trend > 0) {
      return <TrendingUp size={16} className="text-green-600" />;
    } else if (trend < 0) {
      return <TrendingDown size={16} className="text-red-600" />;
    }
    return null;
  };

  const getTrendClass = (trend) => {
    if (trend > 0) return 'text-green-600';
    if (trend < 0) return 'text-red-600';
    return 'text-gray-600';
  };

  return (
    <div className="fee-summary">
      <div className="summary-header">
        <h2>Fee Summary</h2>
        <div className="header-actions">
          <button onClick={onGenerateReport} className="btn btn-secondary">
            Generate Report
          </button>
          <button onClick={onViewDetails} className="btn btn-primary">
            View All Payments
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card revenue">
          <div className="card-header">
            <DollarSign size={20} />
            <h3>Total Revenue</h3>
          </div>
          <div className="card-content">
            <div className="card-value">{formatCurrency(totalRevenue)}</div>
            <div className={`card-trend ${getTrendClass(revenueTrend)}`}>
              {getTrendIcon(revenueTrend)}
              <span>{Math.abs(revenueTrend)}%</span>
            </div>
          </div>
          <div className="card-footer">
            <span>Monthly: {formatCurrency(monthlyRevenue)}</span>
          </div>
        </div>

        <div className="summary-card completed">
          <div className="card-header">
            <CheckCircle size={20} />
            <h3>Completed Payments</h3>
          </div>
          <div className="card-content">
            <div className="card-value">{completedPayments}</div>
            <div className="card-subtitle">Successful transactions</div>
          </div>
        </div>

        <div className="summary-card pending">
          <div className="card-header">
            <AlertCircle size={20} />
            <h3>Pending Payments</h3>
          </div>
          <div className="card-content">
            <div className="card-value">{pendingPayments}</div>
            <div className="card-amount">{formatCurrency(pendingAmount)}</div>
          </div>
          <div className={`card-trend ${getTrendClass(pendingTrend)}`}>
            {getTrendIcon(pendingTrend)}
            <span>{Math.abs(pendingTrend)}%</span>
          </div>
        </div>
      </div>

      {/* Recent Payments */}
      <div className="recent-payments">
        <h3>Recent Payments</h3>
        <div className="payments-list">
          {recentPayments.length === 0 ? (
            <div className="no-payments">
              <p>No recent payments</p>
            </div>
          ) : (
            recentPayments.slice(0, 5).map((payment, index) => (
              <div key={index} className="payment-item">
                <div className="payment-info">
                  <div className="payment-student">
                    <span className="student-name">{payment.student?.user?.name}</span>
                    <span className="payment-id">#{payment.referenceNumber}</span>
                  </div>
                  <div className="payment-course">{payment.enrollment?.course?.name}</div>
                </div>
                <div className="payment-details">
                  <div className="payment-amount">{formatCurrency(payment.amount)}</div>
                  <div className="payment-date">
                    <Calendar size={12} />
                    {formatDate(payment.paymentDate)}
                  </div>
                  <div className={`payment-status ${payment.status}`}>
                    {payment.status}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Payment Methods Breakdown */}
      {paymentMethods.length > 0 && (
        <div className="payment-methods">
          <h3>Payment Methods</h3>
          <div className="methods-grid">
            {paymentMethods.map((method, index) => (
              <div key={index} className="method-item">
                <div className="method-name">{method.method}</div>
                <div className="method-stats">
                  <div className="method-count">{method.count} payments</div>
                  <div className="method-amount">{formatCurrency(method.amount)}</div>
                </div>
                <div className="method-percentage">
                  {method.percentage}%
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Monthly Revenue Chart */}
      {revenueByMonth.length > 0 && (
        <div className="revenue-chart">
          <h3>Monthly Revenue</h3>
          <div className="chart-bars">
            {revenueByMonth.map((month, index) => {
              const maxRevenue = Math.max(...revenueByMonth.map(m => m.revenue));
              const percentage = maxRevenue > 0 ? (month.revenue / maxRevenue) * 100 : 0;
              
              return (
                <div key={index} className="chart-bar">
                  <div 
                    className="bar-fill"
                    style={{ height: `${percentage}%` }}
                  ></div>
                  <div className="bar-label">{month.month}</div>
                  <div className="bar-value">{formatCurrency(month.revenue)}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeeSummary;