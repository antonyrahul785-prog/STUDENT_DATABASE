import React from 'react';
import { 
  FileText, Video, Image, 
  Download, Share2, Eye, 
  MoreVertical, Calendar, User 
} from 'lucide-react';
import { format } from 'date-fns';

const ContentCard = ({ 
  content, 
  onView, 
  onEdit, 
  onDelete,
  onDownload,
  onShare,
  onPreview 
}) => {
  const getContentIcon = (type) => {
    switch (type) {
      case 'document':
        return <FileText size={20} />;
      case 'video':
        return <Video size={20} />;
      case 'image':
        return <Image size={20} />;
      case 'presentation':
        return '📊';
      case 'audio':
        return '🎵';
      default:
        return <FileText size={20} />;
    }
  };

  const getContentColor = (type) => {
    switch (type) {
      case 'document':
        return 'bg-blue-100 text-blue-600';
      case 'video':
        return 'bg-red-100 text-red-600';
      case 'image':
        return 'bg-green-100 text-green-600';
      case 'presentation':
        return 'bg-purple-100 text-purple-600';
      case 'audio':
        return 'bg-yellow-100 text-yellow-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return format(new Date(date), 'MMM dd, yyyy');
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <div className="content-card">
      <div className="content-header">
        <div className={`content-icon ${getContentColor(content.type)}`}>
          {getContentIcon(content.type)}
        </div>
        
        <div className="content-info">
          <h3 className="content-title">{content.title}</h3>
          <p className="content-description">
            {content.description?.substring(0, 80)}
            {content.description?.length > 80 ? '...' : ''}
          </p>
        </div>
        
        <div className="content-actions">
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="menu-btn"
            >
              <MoreVertical size={18} />
            </button>
            
            {showMenu && (
              <div className="dropdown-menu">
                <button onClick={() => { onPreview(content); setShowMenu(false); }}>
                  <Eye size={14} />
                  Preview
                </button>
                <button onClick={() => { onView(content); setShowMenu(false); }}>
                  View Details
                </button>
                <button onClick={() => { onEdit(content); setShowMenu(false); }}>
                  Edit
                </button>
                <button onClick={() => { onDownload(content); setShowMenu(false); }}>
                  <Download size={14} />
                  Download
                </button>
                <button onClick={() => { onShare(content); setShowMenu(false); }}>
                  <Share2 size={14} />
                  Share
                </button>
                <button 
                  onClick={() => { onDelete(content); setShowMenu(false); }}
                  className="text-red-600"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="content-meta">
        <div className="meta-item">
          <span className="meta-label">Type:</span>
          <span className="meta-value">{content.type}</span>
        </div>
        
        <div className="meta-item">
          <span className="meta-label">Size:</span>
          <span className="meta-value">{formatFileSize(content.fileSize || 0)}</span>
        </div>
        
        <div className="meta-item">
          <span className="meta-label">Format:</span>
          <span className="meta-value">{content.format || content.fileType}</span>
        </div>
      </div>
      
      <div className="content-footer">
        <div className="footer-left">
          <div className="upload-info">
            <div className="uploader">
              <User size={12} />
              <span>{content.uploadedBy?.name || 'Unknown'}</span>
            </div>
            <div className="upload-date">
              <Calendar size={12} />
              <span>{formatDate(content.uploadedAt)}</span>
            </div>
          </div>
          
          {content.tags && content.tags.length > 0 && (
            <div className="content-tags">
              {content.tags.slice(0, 3).map((tag, index) => (
                <span key={index} className="tag">{tag}</span>
              ))}
              {content.tags.length > 3 && (
                <span className="more-tags">+{content.tags.length - 3}</span>
              )}
            </div>
          )}
        </div>
        
        <div className="footer-right">
          <div className="quick-actions">
            <button 
              onClick={() => onPreview(content)}
              className="action-btn"
              title="Preview"
            >
              <Eye size={16} />
            </button>
            <button 
              onClick={() => onDownload(content)}
              className="action-btn"
              title="Download"
            >
              <Download size={16} />
            </button>
            <button 
              onClick={() => onShare(content)}
              className="action-btn"
              title="Share"
            >
              <Share2 size={16} />
            </button>
          </div>
          
          {content.accessCount !== undefined && (
            <div className="view-count">
              <Eye size={12} />
              <span>{content.accessCount} views</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContentCard;