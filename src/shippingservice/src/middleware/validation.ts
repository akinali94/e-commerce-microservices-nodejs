import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../types';

/**
 * Validates that request body exists
 */
export const validateBody = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (!req.body || Object.keys(req.body).length === 0) {
    const errorResponse: ErrorResponse = {
      error: 'Validation Error',
      message: 'Request body is required',
      statusCode: 400,
      timestamp: new Date().toISOString()
    };
    res.status(400).json(errorResponse);
    return;
  }
  next();
};

/**
 * Validates Content-Type header for POST/PUT requests
 */
export const validateContentType = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
    const contentType = req.get('Content-Type');
    if (!contentType || !contentType.includes('application/json')) {
      const errorResponse: ErrorResponse = {
        error: 'Validation Error',
        message: 'Content-Type must be application/json',
        statusCode: 415,
        timestamp: new Date().toISOString()
      };
      res.status(415).json(errorResponse);
      return;
    }
  }
  next();
};
