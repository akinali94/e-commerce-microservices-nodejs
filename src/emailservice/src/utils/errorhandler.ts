import { Response } from 'express';
import { logger } from './logger';

// Custom error class for application-specific errors
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

// Error types
export const ErrorTypes = {
  VALIDATION_ERROR: 'ValidationError',
  NOT_FOUND: 'NotFoundError',
  TEMPLATE_ERROR: 'TemplateError',
  EMAIL_ERROR: 'EmailError',
  SERVER_ERROR: 'ServerError'
};

// Global error handler for Express
export const globalErrorHandler = (err: Error | AppError, res: Response): void => {
  // Default to 500 Internal Server Error
  const statusCode = 'statusCode' in err ? err.statusCode : 500;
  const message = err.message || 'Something went wrong';
  const isOperational = 'isOperational' in err ? err.isOperational : false;
  
  // Log error
  logger.error(message, { 
    error: err.message,
    stack: err.stack,
    isOperational
  });
  
  // Send response
  res.status(statusCode).json({
    status: 'error',
    message: isOperational ? message : 'An internal server error occurred'
  });
};

// Helper function to create application errors
export const createError = (type: string, message: string): AppError => {
  switch (type) {
    case ErrorTypes.VALIDATION_ERROR:
      return new AppError(message, 400);
    case ErrorTypes.NOT_FOUND:
      return new AppError(message, 404);
    case ErrorTypes.TEMPLATE_ERROR:
    case ErrorTypes.EMAIL_ERROR:
    case ErrorTypes.SERVER_ERROR:
    default:
      return new AppError(message, 500);
  }
};