import React from 'react';
import './LogoutConfirmModal.css';

function LogoutConfirmModal({ isOpen, onConfirm, onCancel }) {
    if (!isOpen) return null;

    return (
        <div className="logout-modal-overlay" onClick={onCancel}>
            <div className="logout-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="logout-modal-header">
                    <div className="logout-icon-wrapper">
                        <span className="logout-icon">⚠️</span>
                    </div>
                    <h2 className="logout-modal-title">Confirm Logout</h2>
                </div>
                
                <div className="logout-modal-body">
                    <p className="logout-modal-text">
                        Are you sure you want to logout? You will need to login again to access your account.
                    </p>
                </div>
                
                <div className="logout-modal-actions">
                    <button 
                        className="logout-cancel-btn" 
                        onClick={onCancel}
                    >
                        <span>Cancel</span>
                    </button>
                    <button 
                        className="logout-confirm-btn" 
                        onClick={onConfirm}
                    >
                        <span>Yes, Logout</span>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default LogoutConfirmModal;
