import { useCallback, useEffect, useState } from 'react';
import { getApiError } from '../api/client';

export function useAsync<T>(loader: () => Promise<T>) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const run = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      setData(await loader());
    } catch (err) {
      setError(getApiError(err));
    } finally {
      setLoading(false);
    }
  }, [loader]);

  useEffect(() => {
    void run();
  }, [run]);

  return { data, loading, error, refresh: run };
}
