import React, { useState } from 'react';
import BaseModal from '../common/Modal/BaseModal';
import { 
  Mail, Link, Copy, Check, 
  Users, Lock, Globe 
} from 'lucide-react';

const ShareModal = ({ 
  isOpen, 
  onClose, 
  content,
  onShare 
}) => {
  const [shareSettings, setShareSettings] = useState({
    accessLevel: content?.accessLevel || 'private',
    expiration: '',
    allowDownloads: true,
    allowComments: true,
    requirePassword: false,
    password: '',
  });

  const [shareLink, setShareLink] = useState(
    `https://edumanage.com/content/${content?.id || 'new'}`
  );
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const [emails, setEmails] = useState([]);
  const [emailMessage, setEmailMessage] = useState(
    `Check out this content: ${content?.title}`
  );

  const handleSettingChange = (name, value) => {
    setShareSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddEmail = () => {
    if (email && /\S+@\S+\.\S+/.test(email) && !emails.includes(email)) {
      setEmails(prev => [...prev, email]);
      setEmail('');
    }
  };

  const handleRemoveEmail = (emailToRemove) => {
    setEmails(prev => prev.filter(e => e !== emailToRemove));
  };

  const handleShareViaEmail = () => {
    if (emails.length === 0) return;
    
    const shareData = {
      content: content,
      emails: emails,
      message: emailMessage,
      settings: shareSettings,
    };
    
    onShare?.(shareData);
    onClose();
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddEmail();
    }
  };

  const generateShareLink = () => {
    const baseUrl = `https://edumanage.com/content/${content?.id}`;
    const params = new URLSearchParams();
    
    if (shareSettings.accessLevel !== 'public') {
      params.append('access', shareSettings.accessLevel);
    }
    
    if (shareSettings.expiration) {
      params.append('expires', shareSettings.expiration);
    }
    
    if (shareSettings.requirePassword && shareSettings.password) {
      params.append('password', shareSettings.password);
    }
    
    const queryString = params.toString();
    const link = queryString ? `${baseUrl}?${queryString}` : baseUrl;
    setShareLink(link);
  };

  React.useEffect(() => {
    generateShareLink();
  }, [shareSettings]);

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title="Share Content"
      size="lg"
    >
      <div className="share-modal">
        {/* Share Link Section */}
        <div className="share-section">
          <h3 className="section-title">
            <Link size={18} />
            Share via Link
          </h3>
          
          <div className="share-link-container">
            <input
              type="text"
              value={shareLink}
              readOnly
              className="share-link-input"
            />
            <button onClick={handleCopyLink} className="copy-btn">
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>

        {/* Access Settings */}
        <div className="settings-section">
          <h3 className="section-title">
            <Lock size={18} />
            Access Settings
          </h3>
          
          <div className="settings-grid">
            <div className="setting-item">
              <label className="setting-label">
                <Globe size={16} />
                Access Level
              </label>
              <select
                value={shareSettings.accessLevel}
                onChange={(e) => handleSettingChange('accessLevel', e.target.value)}
                className="setting-select"
              >
                <option value="private">Private (Only people with link)</option>
                <option value="restricted">Restricted (Specific people)</option>
                <option value="public">Public (Anyone can view)</option>
              </select>
            </div>
            
            <div className="setting-item">
              <label className="setting-label">
                <Users size={16} />
                Link Expiration
              </label>
              <input
                type="datetime-local"
                value={shareSettings.expiration}
                onChange={(e) => handleSettingChange('expiration', e.target.value)}
                className="setting-input"
              />
            </div>
            
            <div className="setting-item">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={shareSettings.allowDownloads}
                  onChange={(e) => handleSettingChange('allowDownloads', e.target.checked)}
                />
                <span>Allow Downloads</span>
              </label>
            </div>
            
            <div className="setting-item">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={shareSettings.allowComments}
                  onChange={(e) => handleSettingChange('allowComments', e.target.checked)}
                />
                <span>Allow Comments</span>
              </label>
            </div>
            
            <div className="setting-item">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={shareSettings.requirePassword}
                  onChange={(e) => handleSettingChange('requirePassword', e.target.checked)}
                />
                <span>Password Protect</span>
              </label>
            </div>
            
            {shareSettings.requirePassword && (
              <div className="setting-item">
                <label className="setting-label">Password</label>
                <input
                  type="password"
                  value={shareSettings.password}
                  onChange={(e) => handleSettingChange('password', e.target.value)}
                  className="setting-input"
                  placeholder="Enter password"
                />
              </div>
            )}
          </div>
        </div>

        {/* Share via Email */}
        <div className="email-section">
          <h3 className="section-title">
            <Mail size={18} />
            Share via Email
          </h3>
          
          <div className="email-input-container">
            <div className="email-input-wrapper">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyPress={handleKeyPress}
                className="email-input"
                placeholder="Enter email addresses"
              />
              <button onClick={handleAddEmail} className="add-email-btn">
                Add
              </button>
            </div>
            
            {emails.length > 0 && (
              <div className="email-tags">
                {emails.map((emailAddr, index) => (
                  <span key={index} className="email-tag">
                    {emailAddr}
                    <button
                      type="button"
                      onClick={() => handleRemoveEmail(emailAddr)}
                      className="remove-email"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
            
            <div className="email-message">
              <label className="message-label">Message (Optional)</label>
              <textarea
                value={emailMessage}
                onChange={(e) => setEmailMessage(e.target.value)}
                className="message-textarea"
                rows="3"
                placeholder="Add a personal message..."
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="share-actions">
          <button onClick={onClose} className="btn btn-secondary">
            Cancel
          </button>
          <button onClick={handleShareViaEmail} className="btn btn-primary" disabled={emails.length === 0}>
            <Mail size={16} />
            Send to {emails.length} {emails.length === 1 ? 'person' : 'people'}
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default ShareModal;