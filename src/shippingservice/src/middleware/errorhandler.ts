import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../types';
import { logger } from '../utils/logger';

/**
 * Global error handler middleware
 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method
  });

  const errorResponse: ErrorResponse = {
    error: 'Internal Server Error',
    message: err.message || 'An unexpected error occurred',
    statusCode: 500,
    timestamp: new Date().toISOString()
  };

  res.status(500).json(errorResponse);
};

/**
 * 404 Not Found handler
 */
export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errorResponse: ErrorResponse = {
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    statusCode: 404,
    timestamp: new Date().toISOString()
  };

  res.status(404).json(errorResponse);
};
