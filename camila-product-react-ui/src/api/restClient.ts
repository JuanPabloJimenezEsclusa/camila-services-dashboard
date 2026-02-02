import axios, { AxiosInstance } from 'axios';
import { Product, WeightParams } from '../types/api';
import { env } from '../config/env.config';
import { getAuthToken } from '../utils/auth';

const API_BASE_URL = env.api.baseUrl;
const API_VERSION = env.app.version;
const ACCEPT_LANGUAGE = env.app.defaultLanguage;

class ProductApiClient {
  private readonly client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Version': API_VERSION,
        'Accept-Language': ACCEPT_LANGUAGE,
      },
    });

    // Add request interceptor to include auth token
    this.client.interceptors.request.use((config) => {
      const token = getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });
  }

  async findById(internalId: string): Promise<Product> {
    const response = await this.client.get<Product>(`/products/${internalId}`);
    return response.data;
  }

  async sortProducts(params: WeightParams): Promise<{ products: Product[]; totalCount?: number }> {
    const response = await this.client.get<Product[]>('/products', {
      params: params,
    });

    const totalCount = response.headers['x-total-count']
      ? Number.parseInt(response.headers['x-total-count'], 10)
      : undefined;

    return {
      products: response.data,
      totalCount,
    };
  }
}

export const productApi = new ProductApiClient();
