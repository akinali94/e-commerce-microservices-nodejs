import { Request, Response } from 'express';
import {
  getQuote,
  shipOrder,
  checkHealth,
  validateQuoteRequest,
  validateShipOrderRequest
} from './service';
import { ShippingQuoteRequest, ShipOrderRequest, ErrorResponse } from './types';
import { logger } from './utils/logger';

/**
 * POST /quote
 * Get a shipping quote
 */
export const getQuoteController = (req: Request, res: Response): void => {
  try {
    const request: ShippingQuoteRequest = req.body;

    // Validate request
    const validationError = validateQuoteRequest(request);
    if (validationError) {
      const errorResponse: ErrorResponse = {
        error: 'Validation Error',
        message: validationError,
        statusCode: 400,
        timestamp: new Date().toISOString()
      };
      res.status(400).json(errorResponse);
      return;
    }

    // Process request
    const response = getQuote(request);
    res.status(200).json(response);
  } catch (error) {
    logger.error('Error in getQuoteController', { error });
    const errorResponse: ErrorResponse = {
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error',
      statusCode: 500,
      timestamp: new Date().toISOString()
    };
    res.status(500).json(errorResponse);
  }
};

/**
 * POST /ship
 * Ship an order and get tracking ID
 */
export const shipOrderController = (req: Request, res: Response): void => {
  try {
    const request: ShipOrderRequest = req.body;

    // Validate request
    const validationError = validateShipOrderRequest(request);
    if (validationError) {
      const errorResponse: ErrorResponse = {
        error: 'Validation Error',
        message: validationError,
        statusCode: 400,
        timestamp: new Date().toISOString()
      };
      res.status(400).json(errorResponse);
      return;
    }

    // Process request
    const response = shipOrder(request);
    res.status(200).json(response);
  } catch (error) {
    logger.error('Error in shipOrderController', { error });
    const errorResponse: ErrorResponse = {
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error',
      statusCode: 500,
      timestamp: new Date().toISOString()
    };
    res.status(500).json(errorResponse);
  }
};

/**
 * GET /health
 * Health check endpoint
 */
export const healthCheckController = (req: Request, res: Response): void => {
  try {
    const response = checkHealth();
    res.status(200).json(response);
  } catch (error) {
    logger.error('Error in healthCheckController', { error });
    const errorResponse: ErrorResponse = {
      error: 'Internal Server Error',
      message: error instanceof Error ? error.message : 'Unknown error',
      statusCode: 500,
      timestamp: new Date().toISOString()
    };
    res.status(500).json(errorResponse);
  }
};
