import { useState, useEffect, createContext, useContext } from 'react';
import { User } from '../types';
import { authService } from '../services/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updateProfile: (userData: any) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          const storedUser = authService.getStoredUser();
          if (storedUser) {
            setUser(storedUser);
          } else {
            // Try to fetch current user from API
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
            authService.storeUserData(
              localStorage.getItem('access_token') || '',
              currentUser
            );
          }
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        authService.logout();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      authService.storeUserData(response.access_token, response.user);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData: any) => {
    try {
      const newUser = await authService.register(userData);
      setUser(newUser);
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateProfile = async (userData: any) => {
    try {
      const updatedUser = await authService.updateProfile(userData);
      setUser(updatedUser);
      authService.storeUserData(
        localStorage.getItem('access_token') || '',
        updatedUser
      );
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
