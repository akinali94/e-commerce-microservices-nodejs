import { Request, Response, NextFunction } from 'express';
import { ListRecommendationsRequest, ErrorResponse, HealthCheckResponse, } from './models';
import { createRecommendationService } from './services';
import { logger } from './logger';
import { validateListRecommendationsRequest } from './validations';



export const listRecommendations = (
  recommendationService: ReturnType<typeof createRecommendationService>
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validation = validateListRecommendationsRequest(req.body);
      if (!validation.valid) {
        const errorResponse: ErrorResponse = {
          error: {
            code: 'INVALID_REQUEST',
            message: validation.error!,
          },
          timestamp: new Date().toISOString(),
        };
        return res.status(400).json(errorResponse);
      }

      const request: ListRecommendationsRequest = req.body;

      logger.info('[Recv ListRecommendations]', {
        userId: request.userId,
        productIdsCount: request.productIds.length,
      });

      const response = await recommendationService.listRecommendations(request);

      logger.info('[Send ListRecommendations]', {
        userId: request.userId,
        recommendedProducts: response.productIds,
      });

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  };
};


export const healthCheck = (req: Request, res: Response) => {
  const healthResponse: HealthCheckResponse = {
    status: 'SERVING',
    timestamp: new Date().toISOString(),
    service: 'recommendation-service',
    version: '1.0.0',
  };

  res.status(200).json(healthResponse);
};