
// Money type to represent currency amounts
export interface Money {
  currencyCode: string;
  units: number;
  nanos: number;
}

// Address information for shipping
export interface Address {
  streetAddress1: string;
  streetAddress2?: string;
  city: string;
  country: string;
  zipCode: string;
}

// Item in an order
export interface OrderItem {
  productId: string;
  quantity: number;
}

// Item with cost information
export interface OrderItemWithCost {
  item: OrderItem;
  cost: Money;
}

// Order information
export interface Order {
  orderId: string;
  items: OrderItemWithCost[];
  shippingAddress: Address;
  shippingCost: Money;
  shippingTrackingId: string;
}

// Request payload for sending order confirmation
export interface SendOrderConfirmationRequest {
  email: string;
  order: Order;
}

// Configuration for the email service
export interface EmailServiceConfig {
  isDummyMode: boolean;
}