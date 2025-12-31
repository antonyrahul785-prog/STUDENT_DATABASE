import React from 'react';
import { 
  Calendar, Clock, Users, 
  MapPin, User, TrendingUp 
} from 'lucide-react';
import { format } from 'date-fns';

const BatchCard = ({ 
  batch, 
  onView, 
  onEdit, 
  onDelete,
  onManageStudents,
  onTakeAttendance 
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'ongoing':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return format(new Date(date), 'MMM dd, yyyy');
  };

  const formatTime = (time) => {
    if (!time) return '';
    return format(new Date(`2000-01-01T${time}`), 'h:mm a');
  };

  const calculateProgress = () => {
    const totalSessions = batch.totalSessions || 0;
    const completedSessions = batch.completedSessions || 0;
    return totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;
  };

  const progress = calculateProgress();
  const availableSeats = (batch.maxStudents || 0) - (batch.currentStudents || 0);

  return (
    <div className="batch-card">
      <div className="batch-header">
        <div className="batch-info">
          <h3 className="batch-name">{batch.name}</h3>
          <p className="batch-code">Code: {batch.batchCode}</p>
        </div>
        
        <div className="batch-status">
          <span className={`status-badge ${getStatusColor(batch.status)}`}>
            {batch.status}
          </span>
        </div>
      </div>
      
      <div className="batch-content">
        <div className="batch-details">
          <div className="detail-item">
            <Calendar size={14} />
            <div>
              <span className="detail-label">Start Date</span>
              <span className="detail-value">{formatDate(batch.startDate)}</span>
            </div>
          </div>
          
          <div className="detail-item">
            <Calendar size={14} />
            <div>
              <span className="detail-label">End Date</span>
              <span className="detail-value">{formatDate(batch.endDate)}</span>
            </div>
          </div>
          
          <div className="detail-item">
            <Clock size={14} />
            <div>
              <span className="detail-label">Schedule</span>
              <span className="detail-value">
                {batch.schedule} {formatTime(batch.startTime)} - {formatTime(batch.endTime)}
              </span>
            </div>
          </div>
          
          <div className="detail-item">
            <Users size={14} />
            <div>
              <span className="detail-label">Students</span>
              <span className="detail-value">
                {batch.currentStudents || 0}/{batch.maxStudents || 0}
                {availableSeats > 0 && (
                  <span className="available-seats"> ({availableSeats} seats left)</span>
                )}
              </span>
            </div>
          </div>
          
          {batch.classroom && (
            <div className="detail-item">
              <MapPin size={14} />
              <div>
                <span className="detail-label">Classroom</span>
                <span className="detail-value">{batch.classroom}</span>
              </div>
            </div>
          )}
          
          {batch.instructor && (
            <div className="detail-item">
              <User size={14} />
              <div>
                <span className="detail-label">Instructor</span>
                <span className="detail-value">{batch.instructor.name}</span>
              </div>
            </div>
          )}
        </div>
        
        <div className="batch-progress">
          <div className="progress-header">
            <span>Course Progress</span>
            <span className="progress-percentage">{progress}%</span>
          </div>
          
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="progress-stats">
            <span>
              {batch.completedSessions || 0} of {batch.totalSessions || 0} sessions completed
            </span>
          </div>
        </div>
      </div>
      
      <div className="batch-footer">
        <div className="batch-actions">
          <button onClick={() => onView(batch)} className="btn btn-sm">
            View Details
          </button>
          
          {batch.status === 'ongoing' && (
            <>
              <button onClick={() => onTakeAttendance(batch)} className="btn btn-sm btn-primary">
                Take Attendance
              </button>
              <button onClick={() => onManageStudents(batch)} className="btn btn-sm btn-secondary">
                Manage Students
              </button>
            </>
          )}
          
          {batch.status === 'upcoming' && (
            <button onClick={() => onEdit(batch)} className="btn btn-sm btn-secondary">
              Edit Batch
            </button>
          )}
          
          {(batch.status === 'upcoming' || batch.status === 'ongoing') && (
            <button 
              onClick={() => onDelete(batch)}
              className="btn btn-sm btn-danger"
            >
              {batch.status === 'ongoing' ? 'Cancel' : 'Delete'}
            </button>
          )}
        </div>
        
        {batch.nextSession && (
          <div className="next-session">
            <Calendar size={12} />
            <span>Next: {formatDate(batch.nextSession)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default BatchCard;