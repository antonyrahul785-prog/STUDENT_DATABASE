import React from 'react';
import { 
  BookOpen, Calendar, Clock, 
  DollarSign, User, TrendingUp 
} from 'lucide-react';
import { format } from 'date-fns';

const EnrollmentCard = ({ 
  enrollment, 
  onView, 
  onEdit, 
  onCancel,
  onGenerateCertificate 
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgress = () => {
    const totalSessions = enrollment.batch?.totalSessions || 0;
    const attendedSessions = enrollment.attendedSessions || 0;
    return totalSessions > 0 ? Math.round((attendedSessions / totalSessions) * 100) : 0;
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return format(new Date(date), 'MMM dd, yyyy');
  };

  const progress = getProgress();
  const progressColor = progress >= 80 ? 'bg-green-600' : 
                       progress >= 50 ? 'bg-yellow-600' : 'bg-red-600';

  return (
    <div className="enrollment-card">
      <div className="enrollment-header">
        <div className="course-info">
          <div className="course-icon">
            <BookOpen size={20} />
          </div>
          <div>
            <h3 className="course-name">{enrollment.course?.name}</h3>
            <p className="batch-name">Batch: {enrollment.batch?.name}</p>
          </div>
        </div>
        
        <span className={`enrollment-status ${getStatusColor(enrollment.status)}`}>
          {enrollment.status}
        </span>
      </div>
      
      <div className="enrollment-content">
        <div className="enrollment-details">
          <div className="detail-item">
            <Calendar size={14} />
            <span>Enrolled: {formatDate(enrollment.enrollmentDate)}</span>
          </div>
          
          <div className="detail-item">
            <Clock size={14} />
            <span>Duration: {enrollment.course?.duration || 'N/A'}</span>
          </div>
          
          <div className="detail-item">
            <DollarSign size={14} />
            <span>Fee: ${enrollment.totalFee || '0'}</span>
          </div>
          
          <div className="detail-item">
            <User size={14} />
            <span>Instructor: {enrollment.batch?.instructor?.name || 'N/A'}</span>
          </div>
        </div>
        
        <div className="progress-section">
          <div className="progress-header">
            <span>Progress</span>
            <span className="progress-percentage">{progress}%</span>
          </div>
          
          <div className="progress-bar">
            <div 
              className={`progress-fill ${progressColor}`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="progress-stats">
            <span>
              {enrollment.attendedSessions || 0} of {enrollment.batch?.totalSessions || 0} sessions
            </span>
            {enrollment.nextSession && (
              <span className="next-session">
                Next: {formatDate(enrollment.nextSession)}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="enrollment-footer">
        <div className="fee-status">
          <div className="fee-paid">
            <DollarSign size={14} />
            <span>Paid: ${enrollment.paidAmount || 0}</span>
          </div>
          <div className="fee-balance">
            <span>Balance: ${(enrollment.totalFee - (enrollment.paidAmount || 0))}</span>
          </div>
        </div>
        
        <div className="enrollment-actions">
          <button onClick={() => onView(enrollment)} className="btn btn-sm">
            View Details
          </button>
          
          {enrollment.status === 'active' && (
            <>
              <button onClick={() => onEdit(enrollment)} className="btn btn-sm btn-secondary">
                Edit
              </button>
              {progress >= 80 && (
                <button onClick={() => onGenerateCertificate(enrollment)} className="btn btn-sm btn-success">
                  Certificate
                </button>
              )}
            </>
          )}
          
          {enrollment.status !== 'completed' && enrollment.status !== 'cancelled' && (
            <button 
              onClick={() => onCancel(enrollment)}
              className="btn btn-sm btn-danger"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnrollmentCard;