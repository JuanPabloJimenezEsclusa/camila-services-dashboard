/**
 * gRPC Client - Binary Protobuf Version
 * Content-Type: application/grpc-web+proto
 * 
 * Development: Vite proxy forwards requests to Envoy (localhost:8765)
 * Production: Direct connection to Envoy or via Nginx reverse proxy
 */

import type { Product } from '../types/api';
import * as protobuf from 'protobufjs';
import { env } from '../config/env.config';

function getGRPCEndpoint(): string {
  return env.api.grpcEndpoint;
}

let root: protobuf.Root | null = null;

async function loadProto(): Promise<protobuf.Root> {
  if (root) return root;
  root = await protobuf.load('/src/proto/product.proto');
  return root;
}

// gRPC response has dynamic structure from protobuf
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function convertGRPCProduct(grpcProduct: any): Product {
  return {
    id: grpcProduct.id,
    internalId: grpcProduct.internalId,
    name: grpcProduct.name,
    category: grpcProduct.category,
    salesUnits: grpcProduct.salesUnits,
    stock: grpcProduct.stock || {},
    profitMargin: grpcProduct.profitMargin,
    daysInStock: grpcProduct.daysInStock,
  };
}

export async function findByIdGRPC(internalId: string): Promise<Product | null> {
  try {
    const root = await loadProto();
    const endpoint = getGRPCEndpoint();
    
    console.log('[gRPC] Fetching product by ID:', internalId);

    const ProductInternalId = root.lookupType('product.ProductInternalId');
    const ProductMessage = root.lookupType('product.Product');

    const requestPayload = { internalId };
    const errMsg = ProductInternalId.verify(requestPayload);
    if (errMsg) throw new Error(errMsg);

    const request = ProductInternalId.create(requestPayload);
    const requestBuffer = ProductInternalId.encode(request).finish();

    console.log('[gRPC] Using Content-Type: application/grpc-web+proto');

    const response = await fetch(`${endpoint}/product.ProductService/GetProductByInternalId`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/grpc-web+proto',
        'X-Grpc-Web': '1',
      },
      body: requestBuffer.buffer as ArrayBuffer,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[gRPC] Error ${response.status}:`, errorText);
      throw new Error(`gRPC error: ${response.status} ${response.statusText}`);
    }

    const responseBuffer = new Uint8Array(await response.arrayBuffer());
    const messageData = responseBuffer.slice(5);
    
    const productMessage = ProductMessage.decode(messageData);
    const product = ProductMessage.toObject(productMessage, {
      defaults: true,
      objects: true,
    });

    console.log('[gRPC] Product fetched:', product);
    return convertGRPCProduct(product);
  } catch (error) {
    console.error('[gRPC] findById error:', error);
    return null;
  }
}

export async function sortProductsGRPC(params: {
  salesUnits?: string;
  stock?: string;
  profitMargin?: string;
  daysInStock?: string;
  page?: string;
  size?: string;
}): Promise<{ products: Product[]; totalCount: number }> {
  try {
    const root = await loadProto();
    const endpoint = getGRPCEndpoint();
    
    const SortRequest = root.lookupType('product.SortByMetricsWeightsRequest');
    const ProductMessage = root.lookupType('product.Product');

    const requestParams: { [key: string]: string } = {};
    if (params.salesUnits) requestParams.salesUnits = params.salesUnits;
    if (params.stock) requestParams.stock = params.stock;
    if (params.profitMargin) requestParams.profitMargin = params.profitMargin;
    if (params.daysInStock) requestParams.daysInStock = params.daysInStock;
    if (params.page) requestParams.page = params.page;
    if (params.size) requestParams.size = params.size;

    console.log('[gRPC] Sorting products with params:', requestParams);
    console.log('[gRPC] Using Content-Type: application/grpc-web+proto');

    const requestPayload = { requestParams };
    const errMsg = SortRequest.verify(requestPayload);
    if (errMsg) throw new Error(errMsg);

    const request = SortRequest.create(requestPayload);
    const requestBuffer = SortRequest.encode(request).finish();

    const response = await fetch(`${endpoint}/product.ProductService/SortByMetricsWeights`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/grpc-web+proto',
        'X-Grpc-Web': '1',
      },
      body: requestBuffer.buffer as ArrayBuffer,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[gRPC] Error ${response.status}:`, errorText);
      throw new Error(`gRPC error: ${response.status} ${response.statusText}`);
    }

    const responseBuffer = new Uint8Array(await response.arrayBuffer());
    const products: Product[] = [];
    
    let offset = 0;
    while (offset < responseBuffer.length) {
      if (offset + 5 > responseBuffer.length) break;
      
      // Read frame: 1-byte compressed flag + 4-byte message length
      const length = new DataView(responseBuffer.buffer).getUint32(offset + 1, false);
      
      offset += 5;
      
      if (offset + length > responseBuffer.length) break;
      
      const messageData = responseBuffer.slice(offset, offset + length);
      
      try {
        const productMessage = ProductMessage.decode(messageData);
        const product = ProductMessage.toObject(productMessage, {
          defaults: true,
          objects: true,
        });
        products.push(convertGRPCProduct(product));
      } catch (e) {
        console.warn('[gRPC] Failed to decode message at offset', offset, e);
      }
      
      offset += length;
    }

    console.log(`[gRPC] Fetched ${products.length} products`);

    return {
      products,
      totalCount: products.length,
    };
  } catch (error) {
    console.error('[gRPC] sortProducts error:', error);
    return { products: [], totalCount: 0 };
  }
}

export const grpcApi = {
  findById: findByIdGRPC,
  sortProducts: sortProductsGRPC,
};
