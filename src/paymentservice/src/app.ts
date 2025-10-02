import express, { Request, Response, NextFunction } from 'express';
import paymentRoutes from './routes';
import { logger } from './utils/logger';

export default function createApp() {
  const app = express();

  app.use(express.json());

  app.use((_req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Methods', 'GET, POST');
    next();
  });

  app.use((req: Request, _res: Response, next: NextFunction) => {
    logger.info(`${req.method} ${req.path}`);
    next();
  });

  app.use('/api/payment', paymentRoutes);

  app.get('/', (_req, res) => {
    res.json({
      service: 'PaymentService REST API',
      version: '1.0.0',
      endpoints: {
        charge: 'POST /api/payment/charge',
        health: 'GET /api/payment/health'
      }
    });
  });

  app.use((_req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use((error: unknown, _req: Request, res: Response, _next: NextFunction) => {
    logger.error({ err: error }, 'Unhandled error');
    res.status(500).json({ error: 'Internal server error' });
  });

  return app;
}
