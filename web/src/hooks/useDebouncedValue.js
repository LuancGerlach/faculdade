import { useEffect, useState } from 'react';

export default function useDebouncedValue(value, delayInMs = 350) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timeoutId = setTimeout(() => setDebouncedValue(value), delayInMs);
    return () => clearTimeout(timeoutId);
  }, [value, delayInMs]);

  return debouncedValue;
}
