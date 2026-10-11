import { useCallback, useEffect, useState } from 'react';
import { findProducts } from '../api/productApi';
import { getErrorMessage } from '../api/errorHandler';

export function useProducts(filters) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const filtersKey = JSON.stringify(filters);

  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await findProducts(JSON.parse(filtersKey));
      setProducts(response.data);
    } catch (requestError) {
      setError(getErrorMessage(requestError, 'Não foi possível carregar os produtos.'));
    } finally {
      setIsLoading(false);
    }
  }, [filtersKey]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return { products, isLoading, error, refetch: fetchProducts };
}
