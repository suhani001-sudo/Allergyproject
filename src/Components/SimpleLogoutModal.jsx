import React from 'react';

function SimpleLogoutModal({ show, onConfirm, onCancel }) {
    if (!show) return null;

    return (
        <div 
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 999999,
                fontFamily: 'Arial, sans-serif'
            }}
            onClick={onCancel}
        >
            <div 
                style={{
                    backgroundColor: 'white',
                    borderRadius: '20px',
                    padding: '2rem',
                    maxWidth: '400px',
                    width: '90%',
                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
                    textAlign: 'center'
                }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Icon */}
                <div 
                    style={{
                        width: '80px',
                        height: '80px',
                        margin: '0 auto 1.5rem',
                        backgroundColor: '#ff6b6b',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '2.5rem'
                    }}
                >
                    ⚠️
                </div>

                {/* Title */}
                <h2 
                    style={{
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        color: '#2c3e50',
                        margin: '0 0 1rem 0'
                    }}
                >
                    Confirm Logout
                </h2>

                {/* Message */}
                <p 
                    style={{
                        fontSize: '1rem',
                        color: '#666',
                        lineHeight: '1.6',
                        margin: '0 0 2rem 0'
                    }}
                >
                    Are you sure you want to logout? You will need to login again to access your account.
                </p>

                {/* Buttons */}
                <div 
                    style={{
                        display: 'flex',
                        gap: '1rem',
                        justifyContent: 'center'
                    }}
                >
                    <button
                        onClick={onCancel}
                        style={{
                            flex: 1,
                            padding: '0.875rem 1.5rem',
                            backgroundColor: '#f8f9fa',
                            color: '#666',
                            border: '2px solid #e0e0e0',
                            borderRadius: '12px',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.backgroundColor = '#e9ecef';
                            e.target.style.transform = 'translateY(-2px)';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.backgroundColor = '#f8f9fa';
                            e.target.style.transform = 'translateY(0)';
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        style={{
                            flex: 1,
                            padding: '0.875rem 1.5rem',
                            backgroundColor: '#dc3545',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 15px rgba(220, 53, 69, 0.3)'
                        }}
                        onMouseOver={(e) => {
                            e.target.style.backgroundColor = '#c82333';
                            e.target.style.transform = 'translateY(-2px)';
                        }}
                        onMouseOut={(e) => {
                            e.target.style.backgroundColor = '#dc3545';
                            e.target.style.transform = 'translateY(0)';
                        }}
                    >
                        Yes, Logout
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SimpleLogoutModal;
