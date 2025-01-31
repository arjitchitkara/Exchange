import { useEffect, useRef, useState } from 'react';

interface SmartPollingOptions {
  initialInterval?: number;
  minInterval?: number;
  maxInterval?: number;
  onError?: (error: any) => void;
}

export function useSmartPolling<T>(
  fetchFn: () => Promise<T>,
  options: SmartPollingOptions = {}
) {
  const {
    initialInterval = 5000,
    minInterval = 3000,
    maxInterval = 30000,
    onError
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Keep track of current interval
  const intervalRef = useRef(initialInterval);
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  // Track if component is mounted
  const mountedRef = useRef(true);

  // Function to adjust polling interval based on changes
  const adjustInterval = (newData: T, oldData: T | null) => {
    if (!oldData) return;
    
    // Compare data to determine if we should change interval
    const hasChanged = JSON.stringify(newData) !== JSON.stringify(oldData);
    
    if (hasChanged) {
      // If data changed, decrease interval (poll more frequently)
      intervalRef.current = Math.max(
        intervalRef.current * 0.8,
        minInterval
      );
    } else {
      // If data didn't change, increase interval (poll less frequently)
      intervalRef.current = Math.min(
        intervalRef.current * 1.2,
        maxInterval
      );
    }
  };

  const fetchData = async () => {
    if (!mountedRef.current) return;
    
    try {
      const newData = await fetchFn();
      if (mountedRef.current) {
        adjustInterval(newData, data);
        setData(newData);
        setError(null);
      }
    } catch (err) {
      if (mountedRef.current) {
        setError(err as Error);
        onError?.(err);
      }
    } finally {
      if (mountedRef.current) {
        // Schedule next poll
        timeoutRef.current = setTimeout(fetchData, intervalRef.current);
      }
    }
  };

  useEffect(() => {
    fetchData();

    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { 
    data: data as T, 
    error, 
    isLoading: isLoading || !data 
  };
} 