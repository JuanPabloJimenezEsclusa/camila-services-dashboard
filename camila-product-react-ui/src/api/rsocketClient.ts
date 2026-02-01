/**
 * RSocket Client - CBOR (RFC 7049) Encoding
 * Uses CBOR binary format for efficient data serialization
 * Content-Type: application/cbor
 * Backend: Spring RSocket with CBOR encoder/decoder
 */

import { RSocketClient, IdentitySerializer } from 'rsocket-core';
import RSocketWebSocketClient from 'rsocket-websocket-client';
import { encode, decode } from 'cbor-x';
import { Product, WeightParams } from '../types/api';
import { env } from '../config/env.config';

// Logger for debugging
const log = (message: string, data?: unknown) => {
  console.log(`[RSocket] ${message}`, data || '');
};

// Get RSocket WebSocket URL from environment configuration
function getRSocketEndpoint(): string {
  return env.api.rsocketUrl;
}

// CBOR serializer for binary encoding (uses any due to rsocket-core typings)
/* eslint-disable @typescript-eslint/no-explicit-any */
const CborSerializer = {
  serialize: (data: any) => {
    // Encode to CBOR binary
    return Buffer.from(encode(data));
  },
  deserialize: (data: any) => {
    // Decode from CBOR binary
    return decode(new Uint8Array(data));
  },
};

// Singleton RSocket client and socket instances
let clientInstance: RSocketClient<any, string> | null = null;
let socketInstance: any = null;
let isConnecting = false;
let connectionPromise: Promise<any> | null = null;
/* eslint-enable @typescript-eslint/no-explicit-any */

// Create and connect RSocket client, return socket
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getSocket(): Promise<any> {
  if (socketInstance) {
    return socketInstance;
  }

  if (isConnecting && connectionPromise) {
    return await connectionPromise;
  }

  isConnecting = true;
  connectionPromise = new Promise((resolve, reject) => {
    try {
      const endpoint = getRSocketEndpoint();
      log(`Connecting to ${endpoint} with CBOR encoding`);

      const client = new RSocketClient({
        serializers: {
          data: CborSerializer,
          metadata: IdentitySerializer,
        },
        setup: {
          keepAlive: 60000,
          lifetime: 180000,
          dataMimeType: 'application/cbor',  // CBOR MIME type
          metadataMimeType: 'message/x.rsocket.routing.v0',
        },
        transport: new RSocketWebSocketClient({
          url: endpoint,
        }),
      });

      client.connect().subscribe({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onComplete: (socket: any) => {
          log('Connected successfully with CBOR encoding');
          clientInstance = client;
          socketInstance = socket;
          isConnecting = false;
          resolve(socket);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        onError: (error: any) => {
          log('Connection error:', error);
          isConnecting = false;
          clientInstance = null;
          socketInstance = null;
          reject(error);
        },
      });
    } catch (error) {
      log('Failed to create client:', error);
      isConnecting = false;
      reject(error);
    }
  });

  return await connectionPromise;
}

// RSocket request-response: findByInternalId (CBOR)
export async function findByIdRSocket(internalId: string): Promise<Product> {
  try {
    log(`Finding product by ID: ${internalId} (CBOR encoding)`);
    
    const socket = await getSocket();

    const route = 'products.request-response-findByInternalId';
    const routeBuffer = Buffer.from(String.fromCodePoint(route.length) + route);

    // Request payload (will be CBOR encoded by serializer)
    const requestPayload = { internalId };

    return new Promise((resolve, reject) => {
      socket
        .requestResponse({
          data: requestPayload,  // CBOR serializer handles encoding
          metadata: routeBuffer.toString('binary'),
        })
        .subscribe({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onComplete: (payload: any) => {
            try {
              // CBOR serializer handles decoding
              const product = payload.data as Product;
              log('Product found:', product.internalId);
              resolve(product);
            } catch (error) {
              log('Failed to decode product:', error);
              reject(new Error('Failed to decode CBOR response'));
            }
          },
          onError: (error: Error) => {
            log('findById error:', error);
            reject(new Error(`RSocket error: ${error.message}`));
          },
        });
    });
  } catch (error) {
    log('findById error:', error);
    throw error instanceof Error ? error : new Error('Unknown RSocket error');
  }
}

// RSocket request-stream: sortProducts (CBOR)
export async function sortProductsRSocket(
  params: WeightParams
): Promise<{ products: Product[]; totalCount?: number }> {
  try {
    log('Sorting products with params (CBOR encoding):', params);
    
    const socket = await getSocket();

    const route = 'products.request-stream-sortByMetricsWeights';
    const routeBuffer = Buffer.from(String.fromCodePoint(route.length) + route);

    // Request payload (will be CBOR encoded by serializer)
    const requestPayload = {
      salesUnits: params.salesUnits || '0',
      stock: params.stock || '0',
      profitMargin: params.profitMargin || '0',
      daysInStock: params.daysInStock || '0',
      page: params.page || '0',
      size: params.size || '10',
    };

    const products: Product[] = [];

    return new Promise((resolve, reject) => {
      socket
        .requestStream({
          data: requestPayload,  // CBOR serializer handles encoding
          metadata: routeBuffer.toString('binary'),
        })
        .subscribe({
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onNext: (payload: any) => {
            try {
              // CBOR serializer handles decoding
              const product = payload.data as Product;
              products.push(product);
              log(`Received product ${products.length}: ${product.internalId}`);
            } catch (error) {
              log('Failed to decode product:', error);
            }
          },
          onComplete: () => {
            log(`Stream complete. Total products: ${products.length}`);
            resolve({
              products,
              totalCount: products.length,
            });
          },
          onError: (error: Error) => {
            log('sortProducts error:', error);
            reject(new Error(`RSocket error: ${error.message}`));
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          onSubscribe: (subscription: any) => {
            // Request all items
            subscription.request(2147483647); // Max int32
          },
        });
    });
  } catch (error) {
    log('sortProducts error:', error);
    throw error instanceof Error ? error : new Error('Unknown RSocket error');
  }
}

// Close RSocket connection (for cleanup)
export function closeRSocketConnection(): void {
  if (clientInstance) {
    log('Closing RSocket connection');
    clientInstance.close();
    clientInstance = null;
    socketInstance = null;
  }
}

// Export API interface matching other clients
export const rsocketApi = {
  findById: findByIdRSocket,
  sortProducts: sortProductsRSocket,
  close: closeRSocketConnection,
};
