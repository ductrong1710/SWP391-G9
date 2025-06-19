import React, { createContext, useState, useContext, useEffect } from 'react';

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
    
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        
        // Validate the user object to ensure it has required fields
        if (parsedUser && parsedUser.id && parsedUser.username) {
          setUser(parsedUser);
          setIsAuthenticated(true);
        } else {
          // Invalid user data - clear it
          console.log("Invalid user data found in localStorage, clearing...");
          localStorage.removeItem('user');
        }
      } catch (error) {
        // Handle JSON parse error - clear invalid data
        console.error("Error parsing user data from localStorage:", error);
        localStorage.removeItem('user');
        setAuthError("Error loading saved login. Please log in again.");
      }
    }
    
    setLoading(false);
    console.log("AuthContext initialized, isAuthenticated:", isAuthenticated);
  }, []);

  const login = (userData) => {
    // Validate user data before saving
    if (!userData || !userData.id || !userData.username) {
      console.error("Invalid user data provided to login:", userData);
      setAuthError("Invalid login data");
      return false;
    }
    
    setUser(userData);
    setIsAuthenticated(true);
    setAuthError(null);
    localStorage.setItem('user', JSON.stringify(userData));
    console.log("User logged in:", userData);
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
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
