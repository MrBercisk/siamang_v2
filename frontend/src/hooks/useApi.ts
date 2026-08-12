import { useState, useCallback } from 'react';
import { apiRequest } from '../lib/api';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>() {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = useCallback(async (
    endpoint: string, 
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: unknown
  ): Promise<T | null> => {
    setState({ data: null, loading: true, error: null });
    try {
      const result = await apiRequest<T>(endpoint, {
        method,
        data: body,
      });
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Terjadi kesalahan sistem';
      setState({ data: null, loading: false, error: errorMessage });
      return null;
    }
  }, []);

  return { ...state, execute };
}
