import React from 'react';
import './AdminDeleteModal.css';

const AdminDeleteModal = ({ isOpen, onConfirm, onCancel, itemType, itemName }) => {
  if (!isOpen) return null;

  return (
    <div className="admin-delete-overlay" onClick={onCancel}>
      <div className="admin-delete-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-delete-header">
          <div className="admin-delete-icon">⚠️</div>
          <h2 className="admin-delete-title">Confirm Deletion</h2>
        </div>
        
        <div className="admin-delete-body">
          <p className="admin-delete-message">
            Are you sure you want to delete this {itemType}?
          </p>
          <div className="admin-delete-details">
            <strong>{itemName}</strong>
          </div>
          <p className="admin-delete-warning">
            ⚠️ This action cannot be undone. All associated data will be permanently removed.
          </p>
        </div>
        
        <div className="admin-delete-footer">
          <button className="admin-delete-btn-cancel" onClick={onCancel}>
            Cancel
          </button>
          <button className="admin-delete-btn-confirm" onClick={onConfirm}>
            Delete {itemType}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDeleteModal;
