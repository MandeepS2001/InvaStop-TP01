import api from './api';
import { User, UserCreate, UserLogin, UserUpdate, AuthResponse } from '../types';

export const authService = {
  // Login user
  async login(credentials: UserLogin): Promise<AuthResponse> {
    const formData = new FormData();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);
    
    const response = await api.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  // Register user
  async register(userData: UserCreate): Promise<User> {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Get current user
  async getCurrentUser(): Promise<User> {
    const response = await api.get('/auth/me');
    return response.data;
  },

  // Update user profile
  async updateProfile(userData: UserUpdate): Promise<User> {
    const response = await api.put('/auth/me', userData);
    return response.data;
  },

  // Logout user
  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  },

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  },

  // Get stored user data
  getStoredUser(): User | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Store user data
  storeUserData(token: string, user: User): void {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },
};
