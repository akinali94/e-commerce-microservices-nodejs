// utils/quote.util.ts
import { Quote, Money } from '../types';

/**
 * Creates a quote from a count of items
 * Note: Currently returns fixed $8.99 regardless of count (matches Go implementation)
 */
export const createQuoteFromCount = (count: number): Quote => {
  return createQuoteFromFloat(8.99);
};

/**
 * Converts a float price to a Quote object
 */
export const createQuoteFromFloat = (value: number): Quote => {
  const units = Math.floor(value);
  const fraction = value - units;
  
  return {
    dollars: units,
    cents: Math.trunc(fraction * 100)
  };
};

/**
 * Converts a Quote to Money format (for API responses)
 */
export const quoteToMoney = (quote: Quote): Money => {
  return {
    currencyCode: 'USD',
    units: quote.dollars,
    nanos: quote.cents * 10000000 // Convert cents to nanoseconds
  };
};

/**
 * Formats a Quote as a string (e.g., "$8.99")
 */
export const formatQuote = (quote: Quote): string => {
  return `$${quote.dollars}.${quote.cents.toString().padStart(2, '0')}`;
};
