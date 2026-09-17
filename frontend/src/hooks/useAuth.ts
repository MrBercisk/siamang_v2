import { useState, useEffect, useCallback } from 'react';
import { User, LoginCredentials, RegisterCredentials, AuthResponse } from '../types/auth';
import { apiRequest, getStoredToken, setStoredToken, ApiError } from '../lib/api';
import { showToast } from '../utils/swal';

export function useAuth() {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('si_amang_user');
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch {
        return null;
      }
    }
    return null;
  });
  
  const [token, setToken] = useState<string | null>(getStoredToken);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Sync token and user to state and local storage
  const handleAuthSuccess = (authUser: User, authToken: string) => {
    setUser(authUser);
    setToken(authToken);
    setStoredToken(authToken);
    localStorage.setItem('si_amang_user', JSON.stringify(authUser));
  };

  const fetchCurrentUser = useCallback(async () => {
    const currentToken = getStoredToken();
    if (!currentToken) return;

    setIsLoading(true);
    try {
      // Endpoint Laravel Sanctum: GET /api/auth/me
      let userData: User;
      const res = await apiRequest<{ user: User }>('/auth/me');
      if (res.user) {
        userData = res.user;
      } else {
        throw new ApiError('Format respons pengguna tidak valid.');
      }

      setUser(userData);
      localStorage.setItem('si_amang_user', JSON.stringify(userData));
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        // Token expired or invalid
        setUser(null);
        setToken(null);
        setStoredToken(null);
        localStorage.removeItem('si_amang_user');
      } else {
        console.warn('Backend API offline. Preserving current session if available.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchCurrentUser();
    }
  }, [token, fetchCurrentUser]);

  const login = async (credentials: LoginCredentials): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // POST to Laravel /api/auth/login endpoint
      const res = await apiRequest<AuthResponse>('/auth/login', {
        method: 'POST',
        data: credentials,
      });

      const authUser = res.user || res.data?.user;
      const authToken = res.token || res.access_token || res.data?.token || res.data?.access_token;

      if (!authUser || !authToken) {
        throw new ApiError('Format respons autentikasi tidak valid.');
      }

      handleAuthSuccess(authUser, authToken);
      showToast('success', res.message || 'Berhasil masuk.');
      setIsLoading(false);
      return true;
    } catch (err: unknown) {
      setIsLoading(false);

      if (err instanceof ApiError) {
        // If the server rejected the request with 401, 422, etc., DO NOT FALLBACK!
        if (!err.isNetworkError) {
          const msg = err.message || 'Login gagal. Periksa kembali email dan password.';
          setError(msg);
          showToast('error', msg);
          return false;
        }

        // Only in network/offline scenario (e.g. preview environment where backend is not running)
        console.info('[SIAMANG] Backend server unreachable. Running in offline preview simulation.');
        showToast('info', 'Mode offline: Backend tidak terhubung, masuk dalam mode pratinjau.');
        
        const fallbackUser: User = {
          id: 'usr_' + Date.now(),
          name: credentials.email.split('@')[0].toUpperCase(),
          email: credentials.email,
          institution: 'Universitas Gadjah Mada',
          role: 'applicant',
        };
        const fallbackToken = 'simulated_token_' + Date.now();
        handleAuthSuccess(fallbackUser, fallbackToken);
        return true;
      }

      const fallbackMsg = 'Terjadi kesalahan saat masuk.';
      setError(fallbackMsg);
      showToast('error', fallbackMsg);
      return false;
    }
  };

  const register = async (credentials: RegisterCredentials): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // POST to Laravel /api/auth/register endpoint
      const res = await apiRequest<AuthResponse>('/auth/register', {
        method: 'POST',
        data: credentials,
      });

      const authUser = res.user || res.data?.user;
      const authToken = res.token || res.access_token || res.data?.token || res.data?.access_token;

      if (!authUser || !authToken) {
        throw new ApiError('Format respons registrasi tidak valid.');
      }

      handleAuthSuccess(authUser, authToken);
      showToast('success', res.message || 'Pendaftaran akun berhasil!');
      setIsLoading(false);
      return true;
    } catch (err: unknown) {
      setIsLoading(false);

      if (err instanceof ApiError) {
        // If the server explicitly rejected the registration (e.g. email already exists, 422)
        if (!err.isNetworkError) {
          const msg = err.message || 'Registrasi gagal. Periksa kembali data Anda.';
          setError(msg);
          showToast('error', msg);
          return false;
        }

        // Offline network fallback for preview demonstration only
        console.info('[SIAMANG] Backend server unreachable. Running in offline preview simulation.');
        showToast('info', 'Mode offline: Backend tidak terhubung, akun simulasi dibuat.');

        const fallbackUser: User = {
          id: 'usr_' + Date.now(),
          name: credentials.name,
          email: credentials.email,
          institution: credentials.institution || 'Universitas Negeri Yogyakarta',
          nim: credentials.nim,
          role: 'applicant',
        };
        const fallbackToken = 'simulated_token_' + Date.now();
        handleAuthSuccess(fallbackUser, fallbackToken);
        return true;
      }

      const fallbackMsg = 'Terjadi kesalahan saat mendaftar.';
      setError(fallbackMsg);
      showToast('error', fallbackMsg);
      return false;
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      // POST to Laravel /api/auth/logout
      await apiRequest('/auth/logout', { method: 'POST' });
    } catch {
      // Ignore network errors on logout
    } finally {
      setUser(null);
      setToken(null);
      setStoredToken(null);
      localStorage.removeItem('si_amang_user');
      setIsLoading(false);
      showToast('info', 'Anda telah keluar dari sistem.');
    }
  };
  const changePassword = async (payload: {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
  }): Promise<boolean> => {
    setIsLoading(true);
    try {
      await apiRequest('/auth/change-password', {
        method: 'POST',
        data: payload,
      });

      // Update flag lokal supaya guard/redirect tidak lagi memaksa
      // ke halaman ganti password setelah ini.
      if (user) {
        const updatedUser: User = { ...user, must_change_password: false };
        setUser(updatedUser);
        localStorage.setItem('si_amang_user', JSON.stringify(updatedUser));
      }

      showToast('success', 'Password berhasil diperbarui.');
      setIsLoading(false);
      return true;
    } catch (err) {
      setIsLoading(false);
      const msg = err instanceof ApiError ? err.message : 'Gagal memperbarui password.';
      showToast('error', msg);
      return false;
    }
  };

  return {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    register,
    logout,
    changePassword,
    refetchUser: fetchCurrentUser,
  };
}
