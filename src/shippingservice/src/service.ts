// services/shipping.service.ts
import { ShippingQuoteRequest, ShippingQuoteResponse, ShipOrderRequest, ShipOrderResponse, Quote, Money } from './types';
import { createTrackingId, formatAddressForTracking } from './utils/tracker';
import { createQuoteFromCount, quoteToMoney } from './utils/quote'
import { logger } from './utils/logger';

/**
 * Gets a shipping quote based on address and items
 */
export const getQuote = (request: ShippingQuoteRequest): ShippingQuoteResponse => {
  logger.info('[GetQuote] received request', {
    city: request.address.city,
    itemCount: request.items.length
  });

  try {
    // Calculate total item count
    const totalItems = request.items.reduce((sum, item) => sum + item.quantity, 0);
    
    // Generate quote based on count
    // TODO(): Current implementation returns fixed $8.99 regardless of count
    const quote: Quote = createQuoteFromCount(totalItems);
    
    // Convert to Money format
    const costUsd: Money = quoteToMoney(quote);

    logger.info('[GetQuote] completed request', {
      totalItems,
      cost: `${costUsd.units}.${costUsd.nanos}`
    });

    return { costUsd };
  } catch (error) {
    logger.error('[GetQuote] error processing request', { error });
    throw error;
  }
};

/**
 * Ships an order and returns a tracking ID
 */
export const shipOrder = (request: ShipOrderRequest): ShipOrderResponse => {
  logger.info('[ShipOrder] received request', {
    city: request.address.city,
    itemCount: request.items.length
  });

  try {
    // Create base address string for tracking ID
    const baseAddress = formatAddressForTracking(request.address);
    
    // Generate tracking ID
    const trackingId = createTrackingId(baseAddress);

    logger.info('[ShipOrder] completed request', {
      trackingId,
      addressLength: baseAddress.length
    });

    return { trackingId };
  } catch (error) {
    logger.error('[ShipOrder] error processing request', { error });
    throw error;
  }
};

/**
 * Health check service
 */
export const checkHealth = (): { status: 'SERVING' | 'NOT_SERVING'; timestamp: string } => {
  return {
    status: 'SERVING',
    timestamp: new Date().toISOString()
  };
};

/**
 * Validates shipping quote request
 */
export const validateQuoteRequest = (request: any): string | null => {
  if (!request.address) {
    return 'Address is required';
  }

  if (!request.address.streetAddress || !request.address.city || !request.address.state) {
    return 'Address must include streetAddress, city, and state';
  }

  if (!request.items || !Array.isArray(request.items)) {
    return 'Items array is required';
  }

  if (request.items.length === 0) {
    return 'At least one item is required';
  }

  for (const item of request.items) {
    if (!item.productId) {
      return 'Each item must have a productId';
    }
    if (typeof item.quantity !== 'number' || item.quantity <= 0) {
      return 'Each item must have a positive quantity';
    }
  }

  return null;
};

/**
 * Validates ship order request
 */
export const validateShipOrderRequest = (request: any): string | null => {
  // Same validation as quote request
  return validateQuoteRequest(request);
};