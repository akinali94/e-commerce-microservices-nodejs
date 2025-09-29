import { Router } from 'express';
import * as currencyController from './controller';

export function createCurrencyRoutes(): Router {
  const router = Router();

  
  router.get('/currencies', currencyController.getSupportedCurrencies);
  router.get('/convert', currencyController.convertCurrency);
  router.get('/health', currencyController.healthCheck);

  return router;
}

export const currencyRoutes = createCurrencyRoutes();