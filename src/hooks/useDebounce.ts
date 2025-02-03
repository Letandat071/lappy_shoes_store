import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  
  // Add console.log
  console.log('useDebounce called with value:', value);

  useEffect(() => {
    console.log('Setting up debounce timer for value:', value);
    const timer = setTimeout(() => {
      console.log('Debounce timer fired with value:', value);
      setDebouncedValue(value);
    }, delay);

    return () => {
      console.log('Cleaning up debounce timer');
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
} 