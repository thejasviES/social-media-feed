export interface AuthFormData {
    email: string;
    password: string;
    fullName?: string;
  }
  
  export interface AuthError {
    message: string;
  }
  
  export interface User {
    id: string;
    email: string;
    created_at: string;
  }
  
  export interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    setUser: (user: User | null) => void;
    setIsAuthenticated: (value: boolean) => void;
    setIsLoading: (value: boolean) => void;
    logout: () => void;
  }