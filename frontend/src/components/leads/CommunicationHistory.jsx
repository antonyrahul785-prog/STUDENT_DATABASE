import React, { useState } from 'react';
import { 
  Phone, Mail, MessageSquare, 
  Calendar, User, Plus 
} from 'lucide-react';
import { format } from 'date-fns';

const CommunicationHistory = ({ communications = [], onAddCommunication }) => {
  const [newNote, setNewNote] = useState('');
  const [communicationType, setCommunicationType] = useState('note');
  const [scheduledDate, setScheduledDate] = useState('');

  const getCommunicationIcon = (type) => {
    switch (type) {
      case 'call':
        return <Phone size={16} />;
      case 'email':
        return <Mail size={16} />;
      case 'sms':
        return <MessageSquare size={16} />;
      case 'meeting':
        return <Calendar size={16} />;
      default:
        return <MessageSquare size={16} />;
    }
  };

  const getCommunicationColor = (type) => {
    switch (type) {
      case 'call':
        return 'bg-blue-100 text-blue-600';
      case 'email':
        return 'bg-green-100 text-green-600';
      case 'sms':
        return 'bg-purple-100 text-purple-600';
      case 'meeting':
        return 'bg-orange-100 text-orange-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const handleAddCommunication = () => {
    if (!newNote.trim()) return;

    const communication = {
      id: Date.now(),
      type: communicationType,
      content: newNote,
      timestamp: new Date().toISOString(),
      user: 'Current User',
      scheduledDate: communicationType === 'scheduled' ? scheduledDate : null,
    };

    onAddCommunication?.(communication);
    setNewNote('');
    setScheduledDate('');
  };

  const formatDate = (date) => {
    return format(new Date(date), 'MMM dd, yyyy HH:mm');
  };

  return (
    <div className="communication-history">
      <div className="section-header">
        <h3>Communication History</h3>
        <span className="count-badge">{communications.length}</span>
      </div>

      <div className="add-communication">
        <div className="communication-type-selector">
          {['note', 'call', 'email', 'sms', 'meeting', 'scheduled'].map((type) => (
            <button
              key={type}
              className={`type-btn ${communicationType === type ? 'active' : ''}`}
              onClick={() => setCommunicationType(type)}
            >
              {getCommunicationIcon(type)}
              <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
            </button>
          ))}
        </div>

        <div className="communication-input">
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add communication note..."
            className="note-input"
            rows="3"
          />
          
          {communicationType === 'scheduled' && (
            <div className="schedule-input">
              <Calendar size={16} />
              <input
                type="datetime-local"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="datetime-input"
              />
            </div>
          )}

          <button
            onClick={handleAddCommunication}
            disabled={!newNote.trim()}
            className="add-note-btn"
          >
            <Plus size={16} />
            Add {communicationType}
          </button>
        </div>
      </div>

      <div className="communications-list">
        {communications.length === 0 ? (
          <div className="no-communications">
            <MessageSquare size={48} />
            <p>No communications yet</p>
          </div>
        ) : (
          communications.map((comm) => (
            <div key={comm.id} className="communication-item">
              <div className={`communication-icon ${getCommunicationColor(comm.type)}`}>
                {getCommunicationIcon(comm.type)}
              </div>
              
              <div className="communication-content">
                <div className="communication-header">
                  <span className="communication-user">
                    <User size={12} />
                    {comm.user}
                  </span>
                  <span className="communication-time">
                    {formatDate(comm.timestamp)}
                  </span>
                </div>
                
                <p className="communication-message">{comm.content}</p>
                
                {comm.scheduledDate && (
                  <div className="scheduled-info">
                    <Calendar size={12} />
                    <span>Scheduled: {formatDate(comm.scheduledDate)}</span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommunicationHistory;