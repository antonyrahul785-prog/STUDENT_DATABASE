import React from 'react';
import { 
  UserPlus, UserCheck, DollarSign, 
  BookOpen, Clock, CheckCircle 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const RecentActivity = ({ activities = [] }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'lead_added':
        return <UserPlus size={16} />;
      case 'lead_converted':
        return <UserCheck size={16} />;
      case 'payment_received':
        return <DollarSign size={16} />;
      case 'enrollment':
        return <BookOpen size={16} />;
      case 'attendance':
        return <CheckCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'lead_added':
        return 'text-blue-600 bg-blue-50';
      case 'lead_converted':
        return 'text-green-600 bg-green-50';
      case 'payment_received':
        return 'text-purple-600 bg-purple-50';
      case 'enrollment':
        return 'text-orange-600 bg-orange-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const formatTime = (timestamp) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return 'Recently';
    }
  };

  if (activities.length === 0) {
    return (
      <div className="no-activities">
        <p>No recent activities</p>
      </div>
    );
  }

  return (
    <div className="recent-activities">
      <div className="activities-list">
        {activities.map((activity, index) => (
          <div key={index} className="activity-item">
            <div className={`activity-icon ${getActivityColor(activity.type)}`}>
              {getActivityIcon(activity.type)}
            </div>
            
            <div className="activity-content">
              <p className="activity-message">{activity.message}</p>
              <div className="activity-meta">
                <span className="activity-time">{formatTime(activity.timestamp)}</span>
                {activity.user && (
                  <span className="activity-user">by {activity.user}</span>
                )}
              </div>
            </div>
            
            {activity.amount && (
              <div className="activity-amount">
                ${activity.amount}
              </div>
            )}
          </div>
        ))}
      </div>
      
      <button className="view-all-activities">
        View All Activities
      </button>
    </div>
  );
};

export default RecentActivity;