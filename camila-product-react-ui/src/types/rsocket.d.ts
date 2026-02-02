// Type definitions for rsocket libraries (minimal typing available)
/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'rsocket-core' {
  export class RSocketClient<_D = unknown, _M = unknown> {
    constructor(options: any);
    connect(): any;
    close(): void;
  }
  
  export const JsonSerializer: any;
  export const IdentitySerializer: any;
}

declare module 'rsocket-websocket-client' {
  export default class RSocketWebSocketClient {
    constructor(options: { url: string });
  }
}

declare module 'rsocket-flowable' {
  export class Flowable<_T = unknown> {
    subscribe(subscriber: any): void;
  }
}
