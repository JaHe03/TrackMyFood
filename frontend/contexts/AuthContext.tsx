import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { authAPI, User, AuthTokens, AuthState, LoginCredentials, RegisterData } from '../services/auth';

// Auth Context Types
interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (userData: Partial<User>) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
  deleteAccount: (password: string) => Promise<void>;
  refreshUser: () => Promise<void>;
}

// Auth Actions
type AuthAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_TOKENS'; payload: AuthTokens | null }
  | { type: 'SET_AUTHENTICATED'; payload: boolean }
  | { type: 'RESET_AUTH' }
  | { type: 'INITIALIZE'; payload: AuthState };

// Auth Reducer
function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_TOKENS':
      return { ...state, tokens: action.payload };
    case 'SET_AUTHENTICATED':
      return { ...state, isAuthenticated: action.payload };
    case 'RESET_AUTH':
      return {
        user: null,
        tokens: null,
        isAuthenticated: false,
        isLoading: false,
      };
    case 'INITIALIZE':
      return action.payload;
    default:
      return state;
  }
}

// Initial state
const initialState: AuthState = {
  user: null,
  tokens: null,
  isAuthenticated: false,
  isLoading: true,
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Auth Provider Props
interface AuthProviderProps {
  children: ReactNode;
}

// Auth Provider Component
export function AuthProvider({ children }: AuthProviderProps) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state from storage
  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const authState = await authAPI.initializeFromStorage();
      dispatch({ type: 'INITIALIZE', payload: authState });
    } catch (error) {
      console.error('Auth initialization failed:', error);
      dispatch({ type: 'RESET_AUTH' });
    }
  };

  const login = async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await authAPI.login(credentials);
      
      dispatch({ type: 'SET_USER', payload: response.user });
      dispatch({ type: 'SET_TOKENS', payload: { access: response.access, refresh: response.refresh } });
      dispatch({ type: 'SET_AUTHENTICATED', payload: true });
    } catch (error) {
      dispatch({ type: 'RESET_AUTH' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await authAPI.register(userData);
      
      dispatch({ type: 'SET_USER', payload: response.user });
      dispatch({ type: 'SET_TOKENS', payload: { access: response.access, refresh: response.refresh } });
      dispatch({ type: 'SET_AUTHENTICATED', payload: true });
    } catch (error) {
      dispatch({ type: 'RESET_AUTH' });
      throw error;
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      dispatch({ type: 'RESET_AUTH' });
    }
  };

  const updateProfile = async (userData: Partial<User>) => {
    try {
      const updatedUser = await authAPI.updateProfile(userData);
      dispatch({ type: 'SET_USER', payload: updatedUser });
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    try {
      await authAPI.changePassword(oldPassword, newPassword);
    } catch (error) {
      console.error('Password change failed:', error);
      throw error;
    }
  };

  const deleteAccount = async (password: string) => {
    try {
      await authAPI.deleteAccount(password);
      dispatch({ type: 'RESET_AUTH' });
    } catch (error) {
      console.error('Account deletion failed:', error);
      throw error;
    }
  };

  const refreshUser = async () => {
    try {
      const user = await authAPI.getCurrentUser();
      dispatch({ type: 'SET_USER', payload: user });
    } catch (error) {
      console.error('User refresh failed:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    changePassword,
    deleteAccount,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Higher-order component for protected routes
export function withAuth<P extends object>(
  Component: React.ComponentType<P>
): React.ComponentType<P> {
  return function AuthenticatedComponent(props: P) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
      // You can return a loading spinner here
      return null;
    }

    if (!isAuthenticated) {
      // Redirect to login or show login form
      return null;
    }

    return <Component {...props} />;
  };
}
