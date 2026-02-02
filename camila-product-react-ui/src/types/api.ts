export interface Product {
  id?: string;
  internalId: string;
  name: string;
  category: string;
  salesUnits?: number;
  stock?: Record<string, number>;
  profitMargin?: number;
  daysInStock?: number;
}

export interface Problem {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance?: string;
  errors?: Record<string, string[]>;
}

export interface WeightParams {
  salesUnits?: string;
  stock?: string;
  profitMargin?: string;
  daysInStock?: string;
  page?: string;
  size?: string;
}

export type ApiType = 'REST' | 'GraphQL' | 'GRPC' | 'RSOCKET';
