export interface CurrencyData {
    [currencyCode: string]: string
}

export interface SupportedCurrenciesResponse {
    currencyCodes: string[];
}

export interface ConversionResponse {
  result: number;
  from: string;
  to: string;
  amount: number;
}

export interface ErrorResponse {
  error: string;
}

export interface HealthResponse {
  status: string;
  timestamp: string;
}