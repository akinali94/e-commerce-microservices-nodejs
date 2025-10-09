import { Router } from 'express';
import { createRecommendationService } from './services';
import { listRecommendations, healthCheck } from './controllers';

/**
 * Creates and configures all routes for the recommendation service
 */
export const createRoutes = (
  recommendationService: ReturnType<typeof createRecommendationService>
): Router => {
  const router = Router();

  router.get('/health', healthCheck);

  router.post('/recommendations', listRecommendations(recommendationService));

  return router;
};