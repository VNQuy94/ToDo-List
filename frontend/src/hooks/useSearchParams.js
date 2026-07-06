import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to get and set URL search parameters natively.
 * Mimics react-router-dom's useSearchParams hook.
 */
export default function useSearchParams() {
  const [searchParams, setSearchParamsState] = useState(
    () => new URLSearchParams(window.location.search)
  );

  useEffect(() => {
    const handlePopState = () => {
      setSearchParamsState(new URLSearchParams(window.location.search));
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const setSearchParams = useCallback((newParams) => {
    const nextParams = typeof newParams === 'function' ? newParams(searchParams) : newParams;
    const newSearch = nextParams.toString();
    const newUrl = `${window.location.pathname}${newSearch ? `?${newSearch}` : ''}`;
    
    window.history.pushState(null, '', newUrl);
    window.dispatchEvent(new Event('popstate'));
  }, [searchParams]);

  return [searchParams, setSearchParams];
}
