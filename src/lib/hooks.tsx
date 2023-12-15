import { useEffect, useState } from "react";

export function useDebounce<T>(
  defaultValue: T,
  onDebounce?: (value: T) => void,
  delay: number = 500
) {
  const [value, setValue] = useState<T>(defaultValue);
  const [debounceValue, setDebounceValue] = useState<T>(defaultValue);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceValue(value);
      onDebounce?.(value);
    }, delay);
    return () => {
      clearTimeout(handler);
    };
  }, [value]);

  return [value, setValue, debounceValue] as const;
}
