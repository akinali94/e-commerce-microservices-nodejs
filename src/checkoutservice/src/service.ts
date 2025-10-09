import axios, { AxiosInstance } from "axios";
import { randomUUID } from "crypto";
import {
  PlaceOrderRequest,
  PlaceOrderResponse,
  ServiceConfig,
  OrderPreparation,
  CartItem,
  OrderItem,
  Money,
  Address,
  Cart,
  Product,
  ShippingQuoteResponse,
  ShipOrderResponse,
  ChargeResponse,
  ConvertCurrencyResponse,
  CreditCardInfo,
  OrderResult,
} from "./types.js";
import * as money from "./utils/money.js";

export class CheckoutService {
  private cartClient: AxiosInstance;
  private productClient: AxiosInstance;
  private currencyClient: AxiosInstance;
  private shippingClient: AxiosInstance;
  private paymentClient: AxiosInstance;
  private emailClient: AxiosInstance;

  constructor(config: ServiceConfig) {
    this.cartClient = axios.create({
      baseURL: config.cartServiceAddr,
      timeout: 5000,
    });

    this.productClient = axios.create({
      baseURL: config.productCatalogServiceAddr,
      timeout: 5000,
    });

    this.currencyClient = axios.create({
      baseURL: config.currencyServiceAddr,
      timeout: 5000,
    });

    this.shippingClient = axios.create({
      baseURL: config.shippingServiceAddr,
      timeout: 5000,
    });

    this.paymentClient = axios.create({
      baseURL: config.paymentServiceAddr,
      timeout: 5000,
    });

    this.emailClient = axios.create({
      baseURL: config.emailServiceAddr,
      timeout: 5000,
    });
  }

  async placeOrder(req: PlaceOrderRequest): Promise<PlaceOrderResponse> {
    console.log(`[PlaceOrder] user_id=${req.userId} user_currency=${req.userCurrency}`);

    // Generate order ID
    const orderId = randomUUID();

    // Prepare order items and shipping quote
    const prep = await this.prepareOrderItemsAndShippingQuoteFromCart(
      req.userId,
      req.userCurrency,
      req.address
    );

    // Calculate total
    let total: Money = {
      currencyCode: req.userCurrency,
      units: 0,
      nanos: 0,
    };

    total = money.must(money.sum(total, prep.shippingCostLocalized));

    for (const it of prep.orderItems) {
      const multPrice = money.multiplySlow(it.cost, it.item.quantity);
      total = money.must(money.sum(total, multPrice));
    }

    // Charge card
    const txId = await this.chargeCard(total, req.creditCard);
    console.log(`payment went through (transaction_id: ${txId})`);

    // Ship order
    const shippingTrackingId = await this.shipOrder(req.address, prep.cartItems);

    // Empty user cart
    await this.emptyUserCart(req.userId);

    // Create order result
    const orderResult: OrderResult = {
      orderId,
      shippingTrackingId,
      shippingCost: prep.shippingCostLocalized,
      shippingAddress: req.address,
      items: prep.orderItems,
    };

    // Send order confirmation
    try {
      await this.sendOrderConfirmation(req.email, orderResult);
      console.log(`order confirmation email sent to ${req.email}`);
    } catch (error) {
      console.warn(`failed to send order confirmation to ${req.email}:`, error);
    }

    return {
      order: orderResult,
    };
  }

  private async prepareOrderItemsAndShippingQuoteFromCart(
    userId: string,
    userCurrency: string,
    address: Address
  ): Promise<OrderPreparation> {
    // Get user cart
    const cartItems = await this.getUserCart(userId);

    // Prepare order items
    const orderItems = await this.prepOrderItems(cartItems, userCurrency);

    // Get shipping quote
    const shippingUSD = await this.quoteShipping(address, cartItems);

    // Convert shipping cost to user currency
    const shippingPrice = await this.convertCurrency(shippingUSD, userCurrency);

    return {
      orderItems,
      cartItems,
      shippingCostLocalized: shippingPrice,
    };
  }

  private async getUserCart(userId: string): Promise<CartItem[]> {
    try {
      const response = await this.cartClient.get<Cart>(`/v1/carts/${userId}`);
      return response.data.items || [];
    } catch (error) {
      throw new Error(`failed to get user cart during checkout: ${error}`);
    }
  }

  private async emptyUserCart(userId: string): Promise<void> {
    try {
      await this.cartClient.delete(`/v1/carts/${userId}`);
    } catch (error) {
      throw new Error(`failed to empty user cart during checkout: ${error}`);
    }
  }

  private async prepOrderItems(
    items: CartItem[],
    userCurrency: string
  ): Promise<OrderItem[]> {
    const orderItems: OrderItem[] = [];

    for (const item of items) {
      // Get product details
      const product = await this.getProduct(item.productId);

      // Convert price to user currency
      const price = await this.convertCurrency(product.priceUsd, userCurrency);

      orderItems.push({
        item,
        cost: price,
      });
    }

    return orderItems;
  }

  private async getProduct(productId: string): Promise<Product> {
    try {
      const response = await this.productClient.get<Product>(`/api/products/${productId}`);
      return response.data;
    } catch (error) {
      throw new Error(`failed to get product #${productId}: ${error}`);
    }
  }

  private async convertCurrency(from: Money, toCurrency: string): Promise<Money> {
    try {
      const response = await this.currencyClient.get<ConvertCurrencyResponse>(
        "/api/convert",
        {
          params: {
            from_currency: from.currencyCode,
            from_units: from.units,
            from_nanos: from.nanos,
            to_currency: toCurrency,
          },
        }
      );

      return {
        currencyCode: response.data.currencyCode,
        units: response.data.units,
        nanos: response.data.nanos,
      };
    } catch (error) {
      throw new Error(`failed to convert currency: ${error}`);
    }
  }

  private async quoteShipping(address: Address, items: CartItem[]): Promise<Money> {
    try {
      const response = await this.shippingClient.post<ShippingQuoteResponse>(
        "/api/shipping/quote",
        {
          address,
          items,
        }
      );

      return response.data.costUsd;
    } catch (error) {
      throw new Error(`failed to get shipping quote: ${error}`);
    }
  }

  private async shipOrder(address: Address, items: CartItem[]): Promise<string> {
    try {
      const response = await this.shippingClient.post<ShipOrderResponse>(
        "/api/shipping/ship",
        {
          address,
          items,
        }
      );

      return response.data.trackingId;
    } catch (error) {
      throw new Error(`shipment failed: ${error}`);
    }
  }

  private async chargeCard(amount: Money, creditCard: CreditCardInfo): Promise<string> {
    try {
      const response = await this.paymentClient.post<ChargeResponse>(
        "/api/payment/charge",
        {
          amount,
          creditCard,
        }
      );

      return response.data.transactionId;
    } catch (error) {
      throw new Error(`could not charge the card: ${error}`);
    }
  }

  private async sendOrderConfirmation(
    email: string,
    order: OrderResult
  ): Promise<void> {
    try {
      await this.emailClient.post("/api/email/confirmation", {
        email,
        order,
      });
    } catch (error) {
      throw new Error(`failed to send order confirmation: ${error}`);
    }
  }
}