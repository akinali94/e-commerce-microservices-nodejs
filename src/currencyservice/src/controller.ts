import { Request, Response, NextFunction } from 'express';
import * as currencyService from './service';
import { logger } from './utils/logger';


export async function getSupportedCurrencies(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    logger.info('Request received: GET /api/currencies');
    
    const result = await currencyService.getSupportedCurrencies();
    
    logger.info(`Returning ${result.currencyCodes.length} supported currencies`);
    res.status(200).json(result);
    
  } catch (error) {
    logger.error('Error in getSupportedCurrencies controller:', error);
    res.status(500).json({ 
      error: 'Failed to retrieve supported currencies' 
    });
  }
}


export async function convertCurrency(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { from, to, amount } = req.query;
    
    logger.info(`Request received: GET /api/convert?from=${from}&to=${to}&amount=${amount}`);

    if (!from || !to || !amount) {
      logger.warn('Missing required parameters');
      res.status(400).json({ 
        error: 'Missing required parameters: from, to, amount' 
      });
      return;
    }

    const numAmount = parseFloat(amount as string);
    if (isNaN(numAmount)) {
      logger.warn(`Invalid amount value: ${amount}`);
      res.status(400).json({ 
        error: 'Invalid amount. Must be a number' 
      });
      return;
    }

    if (numAmount <= 0) {
      logger.warn(`Negative or zero amount: ${numAmount}`);
      res.status(400).json({ 
        error: 'Amount must be greater than zero' 
      });
      return;
    }

    const result = await currencyService.convertCurrency(
      from as string, 
      to as string, 
      numAmount
    );
    
    logger.info(`Conversion successful: ${numAmount} ${from} = ${result.result} ${to}`);
    res.status(200).json(result);
    
  } catch (error: any) {
    logger.error('Error in convertCurrency controller:', error);
    
    if (error.message.includes('Unsupported currency')) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Conversion failed' });
    }
  }
}


export function healthCheck(req: Request, res: Response): void {
  logger.info('Request received: GET /api/health');
  
  res.status(200).json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'Currency Service'
  });
}


export function getApiInfo(req: Request, res: Response): void {
  res.status(200).json({
    message: 'Currency Service API',
    version: '1.0.0',
    description: 'REST API for currency conversion',
    endpoints: {
      currencies: '/api/currencies',
      convert: '/api/convert?from=USD&to=EUR&amount=100',
      health: '/api/health'
    }
  });
}
