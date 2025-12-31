import React from 'react';
import { 
  BookOpen, Clock, Users, 
  DollarSign, TrendingUp, MoreVertical 
} from 'lucide-react';

const CourseCard = ({ 
  course, 
  onView, 
  onEdit, 
  onDelete,
  onManageBatches,
  onViewSyllabus 
}) => {
  const [showMenu, setShowMenu] = React.useState(false);

  const getDifficultyColor = (level) => {
    switch (level) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="course-card">
      <div className="course-header">
        <div className="course-icon">
          <BookOpen size={24} />
        </div>
        
        <div className="course-info">
          <h3 className="course-name">{course.name}</h3>
          <p className="course-category">{course.category}</p>
        </div>
        
        <div className="course-actions">
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="menu-btn"
            >
              <MoreVertical size={18} />
            </button>
            
            {showMenu && (
              <div className="dropdown-menu">
                <button onClick={() => { onView(course); setShowMenu(false); }}>
                  View Details
                </button>
                <button onClick={() => { onEdit(course); setShowMenu(false); }}>
                  Edit Course
                </button>
                <button onClick={() => { onViewSyllabus(course); setShowMenu(false); }}>
                  View Syllabus
                </button>
                <button onClick={() => { onManageBatches(course); setShowMenu(false); }}>
                  Manage Batches
                </button>
                <button 
                  onClick={() => { onDelete(course); setShowMenu(false); }}
                  className="text-red-600"
                >
                  Delete Course
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <p className="course-description">
        {course.description?.substring(0, 100)}
        {course.description?.length > 100 ? '...' : ''}
      </p>
      
      <div className="course-stats">
        <div className="stat-item">
          <Clock size={14} />
          <span>{course.duration}</span>
        </div>
        
        <div className="stat-item">
          <Users size={14} />
          <span>{course.enrolledCount || 0} students</span>
        </div>
        
        <div className="stat-item">
          <DollarSign size={14} />
          <span>${course.fee}</span>
        </div>
        
        <div className={`difficulty-badge ${getDifficultyColor(course.level)}`}>
          {course.level}
        </div>
      </div>
      
      <div className="course-meta">
        <div className="meta-item">
          <span className="meta-label">Instructor:</span>
          <span className="meta-value">{course.instructor?.name || 'N/A'}</span>
        </div>
        
        <div className="meta-item">
          <span className="meta-label">Batches:</span>
          <span className="meta-value">{course.activeBatches || 0} active</span>
        </div>
      </div>
      
      <div className="course-footer">
        <div className="course-rating">
          <div className="stars">
            {'★'.repeat(Math.floor(course.rating || 0))}
            {'☆'.repeat(5 - Math.floor(course.rating || 0))}
          </div>
          <span className="rating-text">{course.rating || 0}/5</span>
        </div>
        
        <div className="course-cta">
          <button onClick={() => onView(course)} className="btn btn-sm btn-primary">
            View Details
          </button>
          {course.isActive && (
            <button onClick={() => onManageBatches?.(course)} className="btn btn-sm btn-secondary">
              Enroll Now
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;