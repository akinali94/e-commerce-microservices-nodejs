import express, { Application, Request, Response, NextFunction } from 'express';
import { config } from './utils/config';
import { currencyRoutes } from './route';
import { logger } from './utils/logger'
import { ErrorResponse } from './types';


export function createApp(): Application {
  const app = express();

  setupMiddlewares(app);
  setupRoutes(app);
  setupErrorHandlers(app);

  return app;
}

function setupMiddlewares(app: Application): void {
  // Body parser
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // CORS
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', config.corsOrigin);
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    
    
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    
    next();
  });

  
  app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path}`);
    next();
  });
}


function setupRoutes(app: Application): void {
  //root endpoint
  app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
      message: 'Currency Service API',
      version: '1.0.0',
      description: 'REST API for currency conversion',
      endpoints: {
        currencies: {
          path: '/api/currencies',
          method: 'GET',
          description: 'Get list of supported currencies'
        },
        convert: {
          path: '/api/convert',
          method: 'GET',
          description: 'Convert currency',
          example: '/api/convert?from=USD&to=EUR&amount=100',
          parameters: {
            from: 'Source currency code (e.g., USD)',
            to: 'Target currency code (e.g., EUR)',
            amount: 'Amount to convert (must be positive number)'
          }
        },
        health: {
          path: '/api/health',
          method: 'GET',
          description: 'Health check endpoint'
        }
      },
      documentation: 'Visit the endpoints above for more information'
    });
  });

  
  app.use('/api', currencyRoutes);
}


function setupErrorHandlers(app: Application): void {
  app.use((req: Request, res: Response<ErrorResponse>) => {
    logger.warn(`404 - Route not found: ${req.method} ${req.path}`);
    res.status(404).json({
      error: `Cannot ${req.method} ${req.path}`
    });
  });

  
  app.use((error: Error, req: Request, res: Response<ErrorResponse>, next: NextFunction) => {
    logger.error(`Unhandled error: ${error.message}`, error);

    res.status(500).json({
      error: 'Internal server error'
    });
  });
}

export default createApp();