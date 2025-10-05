// =============================================
// FILE: src/controllers/ad.controller.ts
// =============================================

import { Request, Response, NextFunction } from 'express';
import { getAds, getAdsWithLogging } from './service';
import { createAdRequest } from './models';
import { AdServiceError } from './errors';


/**
 * GET /ads
 * Get ads based on optional context keys from query parameters
 * 
 * Query params:
 *   - contextKeys: comma-separated string of categories (e.g., "clothing,kitchen")
 *   - contextKeys[]: array format (e.g., contextKeys[]=clothing&contextKeys[]=kitchen)
 * 
 * Example requests:
 *   - GET /ads
 *   - GET /ads?contextKeys=clothing,kitchen
 *   - GET /ads?contextKeys[]=clothing&contextKeys[]=kitchen
 * 
 * Response: { ads: [...] }
 */
export const getAdsController = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    // Parse context keys from query parameters
    const contextKeys = parseContextKeys(req.query.contextKeys);

    // Create request DTO
    const adRequest = createAdRequest(contextKeys);

    // Call service layer with logging
    const response = getAdsWithLogging(
      adRequest,
      (message) => console.log(`[AdService] ${message}`)
    );

    // Send success response
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /ads/random
 * Get random ads (fallback endpoint)
 * 
 * Query params:
 *   - count: number of ads to return (optional, default: 2)
 * 
 * Example requests:
 *   - GET /ads/random
 *   - GET /ads/random?count=5
 * 
 * Response: { ads: [...] }
 */
export const getRandomAdsController = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const count = req.query.count ? parseInt(req.query.count as string, 10) : undefined;

    // Validate count if provided
    if (count !== undefined && (isNaN(count) || count < 1)) {
      res.status(400).json({
        error: 'Invalid count parameter',
        message: 'Count must be a positive integer',
      });
      return;
    }

    // Create empty request (no context keys)
    const adRequest = createAdRequest();
    const response = getAds(adRequest);

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /ads
 * Get ads based on context keys from request body
 * 
 * Request body:
 *   { "contextKeys": ["clothing", "kitchen"] }
 * 
 * Response: { ads: [...] }
 */
export const postAdsController = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const { contextKeys } = req.body;

    // Create request DTO
    const adRequest = createAdRequest(contextKeys);

    // Call service layer
    const response = getAdsWithLogging(
      adRequest,
      (message) => console.log(`[AdService] ${message}`)
    );

    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

/**
 * Helper: Parse context keys from query parameters
 * Handles both comma-separated string and array formats
 * 
 * @param queryParam - Query parameter value
 * @returns Array of context keys or undefined
 */
const parseContextKeys = (
  queryParam: unknown
): string[] | undefined => {
  if (!queryParam) {
    return undefined;
  }

  // Handle array format: ?contextKeys[]=clothing&contextKeys[]=kitchen
  if (Array.isArray(queryParam)) {
    return queryParam.filter((key) => typeof key === 'string');
  }

  // Handle comma-separated string: ?contextKeys=clothing,kitchen
  if (typeof queryParam === 'string') {
    return queryParam
      .split(',')
      .map((key) => key.trim())
      .filter((key) => key.length > 0);
  }

  return undefined;
};

/**
 * Error handler middleware for ad-related errors
 * Converts service errors to appropriate HTTP responses
 */
export const adErrorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Handle custom AdServiceError
  if (error instanceof AdServiceError) {
    res.status(error.statusCode).json({
      error: error.name,
      message: error.message,
      code: error.code,
    });
    return;
  }

  // Handle generic errors
  console.error('[AdService Error]', error);
  res.status(500).json({
    error: 'InternalServerError',
    message: 'An unexpected error occurred',
  });
};