/**
 * Mock Data for E2E Tests
 * 
 * Centralized mock data used across all E2E test handlers
 */

export interface MockProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  stock?: {
    default: number;
    warehouse?: string;
  };
  salesUnits?: number;
  profitMargin?: number;
  daysInStock?: number;
  category?: string;
  imageUrl?: string;
}

export const mockProducts: MockProduct[] = [
  {
    id: 1,
    name: 'Laptop Pro 15"',
    description: 'High-performance laptop with 16GB RAM',
    price: 1299.99,
    stock: { default: 45 },
    salesUnits: 320,
    profitMargin: 0.25,
    daysInStock: 15,
    category: 'Electronics',
    imageUrl: 'https://via.placeholder.com/300x200?text=Laptop+Pro',
  },
  {
    id: 2,
    name: 'Wireless Mouse',
    description: 'Ergonomic wireless mouse with USB receiver',
    price: 29.99,
    stock: { default: 150 },
    salesUnits: 890,
    profitMargin: 0.45,
    daysInStock: 8,
    category: 'Accessories',
    imageUrl: 'https://via.placeholder.com/300x200?text=Mouse',
  },
  {
    id: 3,
    name: 'USB-C Hub',
    description: '7-in-1 USB-C hub with HDMI and card reader',
    price: 49.99,
    stock: { default: 80 },
    salesUnits: 450,
    profitMargin: 0.35,
    daysInStock: 12,
    category: 'Accessories',
    imageUrl: 'https://via.placeholder.com/300x200?text=USB+Hub',
  },
  {
    id: 4,
    name: 'Mechanical Keyboard',
    description: 'RGB mechanical keyboard with blue switches',
    price: 89.99,
    stock: { default: 65 },
    salesUnits: 280,
    profitMargin: 0.30,
    daysInStock: 20,
    category: 'Accessories',
    imageUrl: 'https://via.placeholder.com/300x200?text=Keyboard',
  },
  {
    id: 5,
    name: '4K Monitor 27"',
    description: 'Ultra HD 4K monitor with HDR support',
    price: 399.99,
    stock: { default: 30 },
    salesUnits: 150,
    profitMargin: 0.20,
    daysInStock: 25,
    category: 'Electronics',
    imageUrl: 'https://via.placeholder.com/300x200?text=Monitor',
  },
];

export const findProductById = (id: number): MockProduct | undefined => {
  return mockProducts.find(p => p.id === id);
};

export const sortProducts = (weights: {
  salesUnits?: number;
  stock?: number;
  profitMargin?: number;
  daysInStock?: number;
}) => {
  return [...mockProducts].sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;

    if (weights.salesUnits) {
      scoreA += (a.salesUnits || 0) * weights.salesUnits;
      scoreB += (b.salesUnits || 0) * weights.salesUnits;
    }
    if (weights.stock) {
      scoreA += (a.stock?.default || 0) * weights.stock;
      scoreB += (b.stock?.default || 0) * weights.stock;
    }
    if (weights.profitMargin) {
      scoreA += (a.profitMargin || 0) * weights.profitMargin;
      scoreB += (b.profitMargin || 0) * weights.profitMargin;
    }
    if (weights.daysInStock) {
      // Inverse: lower days in stock is better
      scoreA += (1 / (a.daysInStock || 1)) * weights.daysInStock;
      scoreB += (1 / (b.daysInStock || 1)) * weights.daysInStock;
    }

    return scoreB - scoreA; // Descending order
  });
};
