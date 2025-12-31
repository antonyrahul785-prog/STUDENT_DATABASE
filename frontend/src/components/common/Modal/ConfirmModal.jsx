import React from 'react';
import BaseModal from './BaseModal';
import { AlertTriangle } from 'lucide-react';

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to perform this action?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'warning',
  isLoading = false,
}) => {
  const typeClasses = {
    warning: 'text-yellow-600 bg-yellow-50',
    danger: 'text-red-600 bg-red-50',
    info: 'text-blue-600 bg-blue-50',
    success: 'text-green-600 bg-green-50',
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
    >
      <div className="confirm-modal">
        <div className={`confirm-icon ${typeClasses[type]}`}>
          <AlertTriangle size={48} />
        </div>
        
        <p className="confirm-message">{message}</p>
        
        <div className="confirm-actions">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="btn btn-secondary"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`btn ${
              type === 'danger' ? 'btn-danger' : 'btn-primary'
            }`}
          >
            {isLoading ? (
              <>
                <div className="spinner-small"></div>
                Processing...
              </>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </BaseModal>
  );
};

export default ConfirmModal;