export interface Address {
  streetAddress: string;
  city: string;
  state: string;
  country: string;
  zipCode?: number;
}


export interface CartItem {
  productId: string;
  quantity: number;
}


export interface Money {
  currencyCode: string;
  units: number;
  nanos: number;
}

export interface Quote {
  dollars: number;
  cents: number;
}


export interface ShippingQuoteRequest {
  address: Address;
  items: CartItem[];
}


export interface ShippingQuoteResponse {
  costUsd: Money;
}


export interface ShipOrderRequest {
  address: Address;
  items: CartItem[];
}


export interface ShipOrderResponse {
  trackingId: string;
}


export interface HealthCheckResponse {
  status: 'SERVING' | 'NOT_SERVING';
  timestamp: string;
}


export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  timestamp: string;
}