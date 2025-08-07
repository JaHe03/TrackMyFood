import AsyncStorage from '@react-native-async-storage/async-storage';

// API base configuration
// The API URL will be determined by environment
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://127.0.0.1:8000/api';

// Types for authentication
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name?: string;
  dob?: string;
  height?: number;
  currWeight?: number;
  activityLevel?: string;
  unitPreference?: string;
  date_joined: string;
  last_login?: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password1: string;
  password2: string;
  first_name?: string;
  last_name?: string;
  dob?: string;
  height?: number;
  currWeight?: number;
  activityLevel?: string;
  unitPreference?: string;
}

export interface AuthResponse {
  access: string;
  refresh: string;
  user: User;
}

export interface AuthState {
  user: User | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Storage keys
const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
};

// API helper function
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.error || `HTTP ${response.status}`);
  }
  
  return response.json();
}

// Authenticated API request helper
async function authenticatedApiRequest(endpoint: string, options: RequestInit = {}) {
  const token = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  
  // If token is expired, try to refresh
  if (response.status === 401) {
    const refreshed = await refreshToken();
    if (refreshed) {
      // Retry the request with new token
      const newToken = await AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
      config.headers = {
        ...config.headers,
        'Authorization': `Bearer ${newToken}`,
      };
      const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, config);
      
      if (!retryResponse.ok) {
        const errorData = await retryResponse.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.error || `HTTP ${retryResponse.status}`);
      }
      
      return retryResponse.json();
    } else {
      throw new Error('Authentication failed');
    }
  }
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.detail || errorData.error || `HTTP ${response.status}`);
  }
  
  return response.json();
}

// Token management
export const tokenManager = {
  async saveTokens(tokens: AuthTokens): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.access);
    await AsyncStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refresh);
  },

  async getAccessToken(): Promise<string | null> {
    return AsyncStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  async getRefreshToken(): Promise<string | null> {
    return AsyncStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
  },

  async clearTokens(): Promise<void> {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.ACCESS_TOKEN,
      STORAGE_KEYS.REFRESH_TOKEN,
      STORAGE_KEYS.USER_DATA,
    ]);
  },

  async saveUser(user: User): Promise<void> {
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(user));
  },

  async getUser(): Promise<User | null> {
    const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  },
};

// Refresh token function
async function refreshToken(): Promise<boolean> {
  try {
    const refreshTokenValue = await tokenManager.getRefreshToken();
    if (!refreshTokenValue) {
      return false;
    }

    const response = await apiRequest('/auth/token/refresh/', {
      method: 'POST',
      body: JSON.stringify({ refresh: refreshTokenValue }),
    });

    await tokenManager.saveTokens({
      access: response.access,
      refresh: response.refresh || refreshTokenValue,
    });

    return true;
  } catch (error) {
    console.error('Token refresh failed:', error);
    await tokenManager.clearTokens();
    return false;
  }
}

// Auth API functions
export const authAPI = {
  // Login
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiRequest('/auth/login/', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    // Save tokens and user data
    await tokenManager.saveTokens({
      access: response.access,
      refresh: response.refresh,
    });
    await tokenManager.saveUser(response.user);

    return response;
  },

  // Register
  async register(userData: RegisterData): Promise<AuthResponse> {
    const response = await apiRequest('/auth/registration/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });

    // Save tokens and user data
    await tokenManager.saveTokens({
      access: response.access,
      refresh: response.refresh,
    });
    
    // Get user details after registration
    const userDetails = await authenticatedApiRequest('/auth/user/');
    await tokenManager.saveUser(userDetails);

    return {
      ...response,
      user: userDetails,
    };
  },

  // Logout
  async logout(): Promise<void> {
    try {
      // Optional: Call backend logout endpoint to blacklist tokens
      const refreshTokenValue = await tokenManager.getRefreshToken();
      if (refreshTokenValue) {
        await apiRequest('/auth/logout/', {
          method: 'POST',
          body: JSON.stringify({ refresh: refreshTokenValue }),
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      await tokenManager.clearTokens();
    }
  },

  // Check authentication status
  async checkAuthStatus(): Promise<{ authenticated: boolean; user: User | null }> {
    try {
      const response = await authenticatedApiRequest('/auth/user/');
      if (response) {
        await tokenManager.saveUser(response);
        return { authenticated: true, user: response };
      }
      return { authenticated: false, user: null };
    } catch (error) {
      console.error('Auth status check failed:', error);
      return { authenticated: false, user: null };
    }
  },

  // Get current user profile
  async getCurrentUser(): Promise<User> {
    return authenticatedApiRequest('/auth/user/');
  },

  // Update user profile
  async updateProfile(userData: Partial<User>): Promise<User> {
    const response = await authenticatedApiRequest('/users/profile/update/', {
      method: 'PATCH',
      body: JSON.stringify(userData),
    });
    await tokenManager.saveUser(response);
    return response;
  },

  // Change password
  async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    await authenticatedApiRequest('/users/change-password/', {
      method: 'POST',
      body: JSON.stringify({
        old_password: oldPassword,
        new_password: newPassword,
      }),
    });
  },

  // Delete account
  async deleteAccount(password: string): Promise<void> {
    await authenticatedApiRequest('/users/delete-account/', {
      method: 'DELETE',
      body: JSON.stringify({ password }),
    });
    await tokenManager.clearTokens();
  },

  // Auto-initialize from stored data
  async initializeFromStorage(): Promise<AuthState> {
    try {
      const user = await tokenManager.getUser();
      const accessToken = await tokenManager.getAccessToken();
      
      if (user && accessToken) {
        // Verify token is still valid
        const authStatus = await this.checkAuthStatus();
        if (authStatus.authenticated) {
          return {
            user: authStatus.user,
            tokens: {
              access: accessToken,
              refresh: await tokenManager.getRefreshToken() || '',
            },
            isAuthenticated: true,
            isLoading: false,
          };
        }
      }
      
      await tokenManager.clearTokens();
      return {
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false,
      };
    } catch (error) {
      console.error('Failed to initialize from storage:', error);
      await tokenManager.clearTokens();
      return {
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false,
      };
    }
  },
};
