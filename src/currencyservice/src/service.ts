
// src/services/currencyService.ts (Function-based)
import fs from 'fs/promises';
import { config } from './utils/config';
import { logger } from './utils/logger';
import {  type CurrencyData, type SupportedCurrenciesResponse, type ConversionResponse } from './types';

// Module-level state (cache)
let cachedData: CurrencyData | null = null;
let lastLoadTime: number = 0;
const CACHE_DURATION = 60 * 60 * 1000; // 1 saat

/**
 * JSON dosyasından currency verilerini oku
 */
async function getCurrencyData(): Promise<CurrencyData> {
  try {
    // check cache
    const now = Date.now();
    if (cachedData && (now - lastLoadTime) < CACHE_DURATION) {
      logger.info('Using cached currency data');
      return cachedData;
    }

    // read from file
    logger.info('Loading currency data from file...');
    const fileContent = await fs.readFile(config.currencyDataPath, 'utf-8');
    const data = JSON.parse(fileContent) as CurrencyData;
    
    if (!data || Object.keys(data).length === 0) {
      throw new Error('Currency data is empty');
    }

    // save to cache
    cachedData = data;
    lastLoadTime = now;
    
    logger.info(`Currency data loaded. ${Object.keys(data).length} currencies available`);
    return data;
    
  } catch (error: any) {
    logger.error('Error reading currency data:', error);
    
    if (cachedData) {
      logger.warn('Using stale cached data due to read error');
      return cachedData;
    }
    
    throw new Error(`Failed to load currency data: ${error.message}`);
  }
}


export async function getSupportedCurrencies(): Promise<SupportedCurrenciesResponse> {
  logger.info('Getting supported currencies...');
  
  try {
    const data = await getCurrencyData();
    const currencyCodes = Object.keys(data).sort();
    
    logger.info(`Found ${currencyCodes.length} supported currencies`);
    
    return { currencyCodes };
  } catch (error) {
    logger.error('Error getting supported currencies:', error);
    throw error;
  }
}


export async function convertCurrency(from: string, to: string, amount: number): Promise<ConversionResponse> {

  logger.info(`Converting ${amount} ${from} to ${to}...`);
  
  try {
    const data = await getCurrencyData();
    
    const fromUpper = from.toUpperCase();
    const toUpper = to.toUpperCase();
    
    if (!data[fromUpper]) {
      throw new Error(`Unsupported currency: ${fromUpper}`);
    }
    
    if (!data[toUpper]) {
      throw new Error(`Unsupported currency: ${toUpper}`);
    }

    const fromRate = parseFloat(data[fromUpper]);
    const toRate = parseFloat(data[toUpper]);
    
    if (isNaN(fromRate) || isNaN(toRate) || fromRate <= 0 || toRate <= 0) {
      throw new Error('Invalid exchange rate data');
    }

    const eurAmount = amount / fromRate;
    const result = eurAmount * toRate;
    const roundedResult = parseFloat(result.toFixed(4));
    
    logger.info(`Conversion successful: ${amount} ${fromUpper} = ${roundedResult} ${toUpper}`);
    
    return { 
      result: roundedResult,
      from: fromUpper,
      to: toUpper,
      amount: amount
    };
    
  } catch (error: any) {
    logger.error('Error converting currency:', error);
    throw error;
  }
}


//Any currency to Euro
export async function getExchangeRate(currencyCode: string): Promise<number> {
  logger.info(`Getting exchange rate for ${currencyCode}...`);
  
  try {
    const data = await getCurrencyData();
    const code = currencyCode.toUpperCase();
    
    if (!data[code]) {
      throw new Error(`Unsupported currency: ${code}`);
    }
    
    const rate = parseFloat(data[code]);
    
    if (isNaN(rate) || rate <= 0) {
      throw new Error(`Invalid exchange rate for ${code}`);
    }
    
    return rate;
    
  } catch (error) {
    logger.error('Error getting exchange rate:', error);
    throw error;
  }
}


export function clearCache(): void {
  logger.info('Clearing currency data cache...');
  cachedData = null;
  lastLoadTime = 0;
}
