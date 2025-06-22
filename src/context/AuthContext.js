import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../services/apiClient';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    // Kiểm tra xem người dùng đã đăng nhập chưa (từ localStorage)
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (storedUser && token) {
      try {
        const parsedUser = JSON.parse(storedUser);
        
        // Validate the user object to ensure it has required fields
        if (parsedUser && parsedUser.userId && parsedUser.username) {
          setUser(parsedUser);
          setIsAuthenticated(true);
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
          // Invalid user data - clear it
          console.log("Invalid user data found in localStorage, clearing...");
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      } catch (error) {
        // Handle JSON parse error - clear invalid data
        console.error("Error parsing user data from localStorage:", error);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setAuthError("Error loading saved login. Please log in again.");
      }
    }
    
    setLoading(false);
    console.log("AuthContext initialized, isAuthenticated:", isAuthenticated);
  }, []);

  const login = async (username, password) => {
    setAuthError(null);
    setLoading(true);
    try {
      const response = await apiClient.post('/Auth/login', { username, password });
      const userData = response.data;

      // Trong thực tế, backend nên trả về token. Ở đây ta dùng tạm dummy token.
      const token = "dummy-jwt-token";

      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      
      setLoading(false);
      return true;
    } catch (error) {
      console.error("Login API call failed:", error.response ? error.response.data : error.message);
      const errorMessage = error.response?.data?.title || error.response?.data || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.';
      setAuthError(errorMessage);
      setIsAuthenticated(false);
      setLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    delete apiClient.defaults.headers.common['Authorization'];
    console.log("User logged out");
  };

  // For debugging purposes
  console.log("AuthContext current state - isAuthenticated:", isAuthenticated, "user:", user);

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      loading, 
      authError,
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
