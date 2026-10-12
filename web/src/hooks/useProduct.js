import { useCallback, useEffect, useState } from 'react';
import { findProductById } from '../api/productApi';
import { getErrorMessage, getErrorStatus } from '../api/errorHandler';

export function useProduct(productId) {
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNotFound, setIsNotFound] = useState(false);

  const fetchProduct = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setIsNotFound(false);
    try {
      const foundProduct = await findProductById(productId);
      setProduct(foundProduct);
    } catch (requestError) {
      setIsNotFound(getErrorStatus(requestError) === 404 || getErrorStatus(requestError) === 400);
      setError(getErrorMessage(requestError, 'Não foi possível carregar o produto.'));
    } finally {
      setIsLoading(false);
    }
  }, [productId]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  return { product, isLoading, error, isNotFound, refetch: fetchProduct };
}
