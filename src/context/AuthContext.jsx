import React, { createContext, useContext, useState, useEffect } from 'react';

// Create Context
const AuthContext = createContext(null);

// Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load dari localStorage saat pertama kali
  useEffect(() => {
    try {
      const savedToken = localStorage.getItem('AuthToken');
      const savedUserId = localStorage.getItem('userId');
      const savedNama = localStorage.getItem('nama');
      const savedEmail = localStorage.getItem('email');

      if (savedToken && savedUserId) {
        setToken(savedToken);
        setUser({
          id: savedUserId,
          nama: savedNama || 'User',
          email: savedEmail || ''
        });
      }
    } catch (error) {
      console.error('Error loading auth data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Login function
  const login = (userData, authToken) => {
    try {
      setUser(userData);
      setToken(authToken);
      
      // Simpan ke localStorage sebagai backup
      localStorage.setItem('AuthToken', authToken);
      localStorage.setItem('token', authToken);
      localStorage.setItem('userId', userData.id);
      localStorage.setItem('nama', userData.nama);
      if (userData.email) {
        localStorage.setItem('email', userData.email);
      }
      
      console.log('✅ Login berhasil, data tersimpan');
    } catch (error) {
      console.error('Error saving auth data:', error);
    }
  };

  // Logout function
  const logout = () => {
    try {
      setUser(null);
      setToken(null);
      
      // Clear localStorage
      localStorage.removeItem('AuthToken');
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('nama');
      localStorage.removeItem('email');
      localStorage.removeItem('password');
      
      console.log('✅ Logout berhasil');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  // Update user data
  const updateUser = (newData) => {
    setUser(prev => {
      const updated = { ...prev, ...newData };
      
      // Update localStorage juga
      if (newData.nama) localStorage.setItem('nama', newData.nama);
      if (newData.email) localStorage.setItem('email', newData.email);
      
      return updated;
    });
  };

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!token && !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom Hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth harus digunakan dalam AuthProvider');
  }
  return context;
};

export default AuthContext;