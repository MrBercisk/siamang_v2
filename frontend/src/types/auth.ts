export interface User {
  id: number | string;
  name: string;
  email: string;
  nim?: string;
  institution?: string;
  major?: string;
  phone?: string;
  role: 'applicant' | 'intern' | 'admin' | 'mentor' | 'alumni';
  avatar_url?: string;
  created_at?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  nim?: string;
  institution?: string;
  password?: string;
  password_confirmation?: string;
}

export interface AuthResponse {
  message?: string;
  token?: string;
  access_token?: string;
  token_type?: string;
  user?: User;
  data?: {
    user?: User;
    token?: string;
    access_token?: string;
  };
}
