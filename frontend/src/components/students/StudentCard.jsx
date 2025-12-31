import React from 'react';
import { 
  User, Mail, Phone, Calendar, 
  BookOpen, MapPin, MoreVertical 
} from 'lucide-react';
import { format } from 'date-fns';

const StudentCard = ({ 
  student, 
  onView, 
  onEdit, 
  onDelete,
  onEnroll,
  onPayment 
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'dropped':
        return 'bg-red-100 text-red-800';
      case 'suspended':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return format(new Date(date), 'MMM dd, yyyy');
  };

  const [showMenu, setShowMenu] = React.useState(false);

  const enrollmentsCount = student.enrollments?.length || 0;
  const activeEnrollments = student.enrollments?.filter(e => e.status === 'active').length || 0;

  return (
    <div className="student-card">
      <div className="student-header">
        <div className="student-avatar">
          {student.user?.name?.charAt(0).toUpperCase()}
        </div>
        
        <div className="student-info">
          <div className="student-name-row">
            <h3 className="student-name">{student.user?.name}</h3>
            <span className={`student-status ${getStatusColor(student.enrollmentStatus)}`}>
              {student.enrollmentStatus}
            </span>
          </div>
          
          <div className="student-id">
            ID: {student.studentId}
          </div>
        </div>
        
        <div className="student-actions">
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="menu-btn"
            >
              <MoreVertical size={18} />
            </button>
            
            {showMenu && (
              <div className="dropdown-menu">
                <button onClick={() => { onView(student); setShowMenu(false); }}>
                  View Profile
                </button>
                <button onClick={() => { onEdit(student); setShowMenu(false); }}>
                  Edit Student
                </button>
                <button onClick={() => { onEnroll(student); setShowMenu(false); }}>
                  New Enrollment
                </button>
                <button onClick={() => { onPayment(student); setShowMenu(false); }}>
                  Process Payment
                </button>
                <button 
                  onClick={() => { onDelete(student); setShowMenu(false); }}
                  className="text-red-600"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="student-content">
        <div className="student-contact">
          <div className="contact-item">
            <Mail size={14} />
            <span>{student.user?.email}</span>
          </div>
          <div className="contact-item">
            <Phone size={14} />
            <span>{student.user?.phone}</span>
          </div>
          {student.personalInfo?.guardianPhone && (
            <div className="contact-item">
              <User size={14} />
              <span>Guardian: {student.personalInfo?.guardianPhone}</span>
            </div>
          )}
        </div>
        
        <div className="student-stats">
          <div className="stat-item">
            <div className="stat-label">Enrollments</div>
            <div className="stat-value">
              <BookOpen size={14} />
              {activeEnrollments}/{enrollmentsCount}
            </div>
          </div>
          
          <div className="stat-item">
            <div className="stat-label">Joined</div>
            <div className="stat-value">
              <Calendar size={14} />
              {formatDate(student.createdAt)}
            </div>
          </div>
        </div>
        
        {student.personalInfo?.address && (
          <div className="student-address">
            <MapPin size={14} />
            <span>
              {[student.personalInfo.address.city, student.personalInfo.address.state]
                .filter(Boolean)
                .join(', ')}
            </span>
          </div>
        )}
      </div>
      
      <div className="student-footer">
        <div className="course-list">
          {student.enrollments?.slice(0, 2).map((enrollment, index) => (
            <span key={index} className="course-tag">
              {enrollment.course?.name}
            </span>
          ))}
          {enrollmentsCount > 2 && (
            <span className="more-courses">+{enrollmentsCount - 2} more</span>
          )}
        </div>
        
        <button 
          onClick={() => onView(student)}
          className="view-profile-btn"
        >
          View Profile
        </button>
      </div>
    </div>
  );
};

export default StudentCard;