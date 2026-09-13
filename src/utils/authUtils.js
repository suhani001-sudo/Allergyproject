/**
 * Centralized Authentication Utilities
 * Handles logout and session management consistently across the app
 */

/**
 * Logout user and clear all session data
 * @param {Function} navigate - React Router navigate function
 */
export const handleLogout = (navigate) => {
    try {
        // Clear all authentication-related data from storage
        localStorage.clear();
        sessionStorage.clear();

        console.log('✅ User logged out successfully');

        // Dispatch auth events so any active listeners update
        window.dispatchEvent(new Event('authChange'));
        window.dispatchEvent(new Event('storage'));

        // Always redirect cleanly to login screen with base URL safety
        const base = (import.meta && import.meta.env && import.meta.env.BASE_URL) ? import.meta.env.BASE_URL : '/';
        window.location.href = `${base}login`;
    } catch (error) {
        console.error('❌ Error during logout:', error);
        const base = (import.meta && import.meta.env && import.meta.env.BASE_URL) ? import.meta.env.BASE_URL : '/';
        window.location.href = `${base}login`;
    }
};

/**
 * Check if user is authenticated
 * @returns {boolean} - True if user has valid token
 */
export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    return !!(token && isLoggedIn === 'true');
};

/**
 * Get current user role
 * @returns {string|null} - User role ('user' or 'restaurant') or null
 */
export const getUserRole = () => {
    return localStorage.getItem('role');
};

/**
 * Get current user data
 * @returns {object|null} - User data object or null
 */
export const getCurrentUser = () => {
    try {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
    }
};

/**
 * Check if session is expired and logout if needed
 * @param {Function} navigate - React Router navigate function
 * @returns {boolean} - True if session is valid
 */
export const checkSession = (navigate) => {
    if (!isAuthenticated()) {
        console.log('⚠️ Session expired or invalid');
        handleLogout(navigate);
        return false;
    }
    return true;
};
