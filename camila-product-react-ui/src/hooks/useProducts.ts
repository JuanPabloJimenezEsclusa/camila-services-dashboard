import { useState, useEffect } from 'react';
import { productApi } from '../api/restClient';
import { findByIdGraphQL, sortProductsGraphQL } from '../api/graphqlClient';
import { grpcApi } from '../api/grpcClient';
import { rsocketApi } from '../api/rsocketClient';
import { Product, WeightParams, ApiType } from '../types/api';

export function useProducts(params: WeightParams, apiType: ApiType = 'REST') {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalCount, setTotalCount] = useState<number | undefined>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        let result;
        if (apiType === 'GraphQL') {
          // GraphQL API
          result = await sortProductsGraphQL({
            salesUnits: Number.parseFloat(params.salesUnits || '0'),
            stock: Number.parseFloat(params.stock || '0'),
            profitMargin: Number.parseFloat(params.profitMargin || '0'),
            daysInStock: Number.parseFloat(params.daysInStock || '0'),
            page: Number.parseInt(params.page || '0'),
            size: Number.parseInt(params.size || '10'),
          });
        } else if (apiType === 'GRPC') {
          // gRPC API (uses string parameters like REST)
          result = await grpcApi.sortProducts(params);
        } else if (apiType === 'RSOCKET') {
          // RSocket API (request-stream)
          result = await rsocketApi.sortProducts(params);
        } else {
          // REST API (default)
          result = await productApi.sortProducts(params);
        }
        setProducts(result.products);
        setTotalCount(result.totalCount);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts().then(r => r);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params), apiType]);

  return { products, totalCount, loading, error };
}

export function useProduct(internalId: string | null, apiType: ApiType = 'REST') {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!internalId) {
      setProduct(null);
      return;
    }

    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        let result;
        if (apiType === 'GraphQL') {
          // GraphQL API
          result = await findByIdGraphQL(internalId);
        } else if (apiType === 'GRPC') {
          // gRPC API
          result = await grpcApi.findById(internalId);
        } else if (apiType === 'RSOCKET') {
          // RSocket API (request-response)
          result = await rsocketApi.findById(internalId);
        } else {
          // REST API (default)
          result = await productApi.findById(internalId);
        }
        setProduct(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct().then(r => r);
  }, [internalId, apiType]);

  return { product, loading, error };
}
