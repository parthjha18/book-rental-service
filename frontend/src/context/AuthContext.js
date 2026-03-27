import { createContext, useState, useContext, useEffect } from 'react';
import API from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const register = async (userData) => {
    try {
      const { data } = await API.post('/auth/register', userData);
      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.data));
        setUser(data.data);
        toast.success(data.message);
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const login = async (credentials) => {
    try {
      const { data } = await API.post('/auth/login', credentials);
      if (data.success) {
        localStorage.setItem('user', JSON.stringify(data.data));
        setUser(data.data);
        toast.success(data.message);
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
  };

  const updateLocation = async (locationData) => {
    try {
      const { data } = await API.put('/auth/update-location', locationData);
      if (data.success) {
        const updatedUser = { ...user, ...data.data };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        toast.success(data.message);
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Location update failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const value = {
    user,
    loading,
    register,
    login,
    logout,
    updateLocation,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
