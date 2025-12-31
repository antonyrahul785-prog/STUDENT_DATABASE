import React from 'react';
import { 
  Phone, Mail, Calendar, 
  User, BookOpen, MoreVertical 
} from 'lucide-react';
import { format } from 'date-fns';

const LeadCard = ({ 
  lead, 
  onView, 
  onConvert, 
  onEdit, 
  onDelete,
  onCall,
  onEmail 
}) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'contacted':
        return 'bg-yellow-100 text-yellow-800';
      case 'follow_up':
        return 'bg-purple-100 text-purple-800';
      case 'converted':
        return 'bg-green-100 text-green-800';
      case 'lost':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSourceIcon = (source) => {
    switch (source) {
      case 'website':
        return '🌐';
      case 'referral':
        return '👥';
      case 'social_media':
        return '📱';
      case 'walkin':
        return '🚶';
      default:
        return '📞';
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return format(new Date(date), 'MMM dd, yyyy');
  };

  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <div className="lead-card">
      <div className="lead-header">
        <div className="lead-info">
          <div className="lead-name">
            <User size={16} />
            <h3>{lead.name}</h3>
          </div>
          <span className={`lead-status ${getStatusColor(lead.status)}`}>
            {lead.status.replace('_', ' ').toUpperCase()}
          </span>
        </div>
        
        <div className="lead-actions">
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="menu-btn"
            >
              <MoreVertical size={18} />
            </button>
            
            {showMenu && (
              <div className="dropdown-menu">
                <button onClick={() => { onView(lead); setShowMenu(false); }}>
                  View Details
                </button>
                <button onClick={() => { onEdit(lead); setShowMenu(false); }}>
                  Edit Lead
                </button>
                {lead.status !== 'converted' && lead.status !== 'lost' && (
                  <button onClick={() => { onConvert(lead); setShowMenu(false); }}>
                    Convert to Student
                  </button>
                )}
                <button 
                  onClick={() => { onDelete(lead); setShowMenu(false); }}
                  className="text-red-600"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="lead-content">
        <div className="lead-contact">
          <div className="contact-item">
            <Phone size={14} />
            <span>{lead.phone}</span>
          </div>
          {lead.email && (
            <div className="contact-item">
              <Mail size={14} />
              <span>{lead.email}</span>
            </div>
          )}
        </div>
        
        <div className="lead-meta">
          <div className="meta-item">
            <span className="meta-label">Source:</span>
            <span className="meta-value">
              {getSourceIcon(lead.source)} {lead.source.replace('_', ' ')}
            </span>
          </div>
          
          {lead.courseInterested && (
            <div className="meta-item">
              <span className="meta-label">Interested:</span>
              <span className="meta-value">
                <BookOpen size={14} />
                {lead.courseInterested.name}
              </span>
            </div>
          )}
          
          {lead.followUpDate && (
            <div className="meta-item">
              <span className="meta-label">Follow-up:</span>
              <span className="meta-value">
                <Calendar size={14} />
                {formatDate(lead.followUpDate)}
              </span>
            </div>
          )}
        </div>
        
        {lead.notes && lead.notes.length > 0 && (
          <div className="lead-notes">
            <p className="notes-preview">
              {lead.notes[lead.notes.length - 1].content.substring(0, 100)}...
            </p>
          </div>
        )}
      </div>
      
      <div className="lead-footer">
        <div className="quick-actions">
          {lead.phone && (
            <button 
              onClick={() => onCall?.(lead.phone)}
              className="action-btn"
              title="Call"
            >
              <Phone size={16} />
            </button>
          )}
          
          {lead.email && (
            <button 
              onClick={() => onEmail?.(lead.email)}
              className="action-btn"
              title="Email"
            >
              <Mail size={16} />
            </button>
          )}
        </div>
        
        <div className="lead-date">
          Added {formatDate(lead.createdAt)}
        </div>
      </div>
    </div>
  );
};

export default LeadCard;