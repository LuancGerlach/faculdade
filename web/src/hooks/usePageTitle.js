import { useEffect } from 'react';

export default function usePageTitle(pageTitle) {
  useEffect(() => {
    document.title = pageTitle ? `${pageTitle} · CS2 Market` : 'CS2 Market';
  }, [pageTitle]);
}
