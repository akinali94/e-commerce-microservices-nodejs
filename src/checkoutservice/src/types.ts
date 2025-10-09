// Types for Checkout Service

export interface Money {
  currencyCode: string;
  units: number;
  nanos: number;
}

export interface Address {
  streetAddress: string;
  city: string;
  state: string;
  country: string;
  zipCode: number;
}

export interface CreditCardInfo {
  creditCardNumber: string;
  creditCardCvv: number;
  creditCardExpirationYear: number;
  creditCardExpirationMonth: number;
}

export interface CartItem {
  productId: string;
  quantity: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  picture: string;
  priceUsd: Money;
  categories: string[];
}

export interface OrderItem {
  item: CartItem;
  cost: Money;
}

export interface OrderResult {
  orderId: string;
  shippingTrackingId: string;
  shippingCost: Money;
  shippingAddress: Address;
  items: OrderItem[];
}

export interface PlaceOrderRequest {
  userId: string;
  userCurrency: string;
  address: Address;
  email: string;
  creditCard: CreditCardInfo;
}

export interface PlaceOrderResponse {
  order: OrderResult;
}

export interface ServiceConfig {
  cartServiceAddr: string;
  productCatalogServiceAddr: string;
  currencyServiceAddr: string;
  shippingServiceAddr: string;
  paymentServiceAddr: string;
  emailServiceAddr: string;
}

export interface OrderPreparation {
  orderItems: OrderItem[];
  cartItems: CartItem[];
  shippingCostLocalized: Money;
}

export interface Cart {
  userId: string;
  items: CartItem[];
}

export interface ShippingQuoteResponse {
  costUsd: Money;
}

export interface ShipOrderResponse {
  trackingId: string;
}

export interface ChargeResponse {
  transactionId: string;
}

export interface ConvertCurrencyResponse {
  currencyCode: string;
  units: number;
  nanos: number;
}