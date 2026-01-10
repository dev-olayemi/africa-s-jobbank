import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, TokenManager, User, AuthResponse } from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  signup: (userData: SignupData) => Promise<void>;
  logout: () => Promise<void>;
  verifyEmail: (code: string) => Promise<void>;
  resendVerification: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

interface SignupData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  role: 'seeker' | 'agent' | 'business' | 'company';
  companyName?: string;
  companySize?: string;
  industry?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      const token = TokenManager.getToken();
      const savedUser = TokenManager.getUser();

      if (token && savedUser) {
        setUser(savedUser);
        
        // Verify token is still valid by fetching current user
        try {
          const response = await api.getCurrentUser();
          if (response.success && response.data) {
            setUser(response.data.user);
            TokenManager.setUser(response.data.user);
          }
        } catch (error) {
          console.error('Token validation failed:', error);
          TokenManager.clear();
          setUser(null);
        }
      }

      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (identifier: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await api.login({ identifier, password });

      if (response.success && response.data) {
        setUser(response.data.user);
        toast.success('Login successful!');
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (userData: SignupData) => {
    try {
      setIsLoading(true);
      const response = await api.signup(userData);

      if (response.success && response.data) {
        setUser(response.data.user);
        toast.success('Registration successful! Please verify your email.');
      } else {
        throw new Error(response.message || 'Signup failed');
      }
    } catch (error: any) {
      toast.error(error.message || 'Signup failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await api.logout();
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      // Clear local state even if API call fails
      TokenManager.clear();
      setUser(null);
    }
  };

  const verifyEmail = async (code: string) => {
    try {
      const response = await api.verifyEmail(code);

      if (response.success) {
        // Update user verification status
        if (user) {
          const updatedUser = {
            ...user,
            verification: {
              ...user.verification,
              email: true,
            },
          };
          setUser(updatedUser);
          TokenManager.setUser(updatedUser);
        }
        toast.success('Email verified successfully!');
      } else {
        throw new Error(response.message || 'Verification failed');
      }
    } catch (error: any) {
      toast.error(error.message || 'Verification failed');
      throw error;
    }
  };

  const resendVerification = async () => {
    try {
      const response = await api.resendVerification();

      if (response.success) {
        toast.success('Verification code sent to your email');
      } else {
        throw new Error(response.message || 'Failed to resend code');
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to resend code');
      throw error;
    }
  };

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      TokenManager.setUser(updatedUser);
    }
  };

  const refreshUser = async () => {
    try {
      const response = await api.getCurrentUser();
      if (response.success && response.data) {
        setUser(response.data.user);
        TokenManager.setUser(response.data.user);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    verifyEmail,
    resendVerification,
    updateUser,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Protected Route Component
export const ProtectedRoute: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast.error('Please login to access this page');
      navigate('/login');
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return isAuthenticated ? <>{children}</> : null;
};