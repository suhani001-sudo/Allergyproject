import React from 'react';
import './LogoutConfirmModal.css';

function LogoutConfirmModal({ isOpen, onConfirm, onCancel }) {
    console.log('LogoutConfirmModal - isOpen:', isOpen);
    
    if (!isOpen) return null;

    // Inline styles as fallback to ensure visibility
    const overlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999
    };

    const contentStyle = {
        backgroundColor: 'white',
        borderRadius: '24px',
        padding: '2.5rem',
        maxWidth: '450px',
        width: '90%',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        position: 'relative',
        zIndex: 100000
    };

    return (
        <div className="logout-modal-overlay" style={overlayStyle} onClick={onCancel}>
            <div className="logout-modal-content" style={contentStyle} onClick={(e) => e.stopPropagation()}>
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
