// auth.js - Create this file in your src/services/ directory
export const AuthService = {
  // Check if user is logged in
  isLoggedIn() {
    return localStorage.getItem('isLoggedIn') === 'true';
  },

  // Get current user data
  getCurrentUser() {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  },

  // Login user (store data)
  login(userData) {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isLoggedIn', 'true');
  },

  // Logout user (clear data)
  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('isLoggedIn');
  },

  // Get user ID
  getUserId() {
    const user = this.getCurrentUser();
    return user ? user.id : null;
  },

  // Check if user is admin
  isAdmin() {
    const user = this.getCurrentUser();
    return user && user.role === 'admin';
  }
};