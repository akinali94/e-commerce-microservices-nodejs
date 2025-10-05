import { Router } from 'express';
import { getAdsController, getRandomAdsController, postAdsController } from './controller';

/**
 * Creates and configures all application routes
 * @returns Configured Express Router
 */
export const createRoutes = (): Router => {
  const router = Router();

  // Health check endpoint
  router.get('/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      service: 'ad-service',
      timestamp: new Date().toISOString(),
    });
  });

  // Main ads endpoints
  router.get('/ads', getAdsController);
  router.post('/ads', postAdsController);
  router.get('/ads/random', getRandomAdsController);

  // API documentation endpoint
  router.get('/', (req, res) => {
    res.status(200).json({
      service: 'Ad Service API',
      version: '1.0.0',
      endpoints: {
        'GET /health': 'Health check',
        'GET /ads': 'Get ads by context keys (query: contextKeys)',
        'POST /ads': 'Get ads by context keys (body: { contextKeys: [] })',
        'GET /ads/random': 'Get random ads (query: count)',
      },
    });
  });

  return router;
};

export default createRoutes;