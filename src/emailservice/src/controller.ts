import { Request, Response, NextFunction } from 'express';
import { sendOrderConfirmation as sendOrderConfirmationService } from './service';
import { SendOrderConfirmationRequest } from './types';
import { logger } from './utils/logger';
import { AppError, globalErrorHandler, createError, ErrorTypes } from './utils/errorhandler';

/**
 * Controller for sending order confirmation emails
 */
export const sendOrderConfirmation = async (
  req: Request, 
  res: Response
): Promise<void> => {
  try {
    const { email, order }: SendOrderConfirmationRequest = req.body;
    
    // Validate request
    if (!email) {
      throw createError(ErrorTypes.VALIDATION_ERROR, 'Email address is required');
    }
    
    if (!order) {
      throw createError(ErrorTypes.VALIDATION_ERROR, 'Order details are required');
    }

    // Call the service function to send the email
    await sendOrderConfirmationService(email, order);
    
    logger.info(`Order confirmation email request processed for ${email}`);
    res.status(200).json({ 
      success: true,
      message: 'Order confirmation email sent successfully'
    });
  } catch (error) {
    // Use global error handler
    globalErrorHandler(error as Error, res);
  }
};

/**
 * Controller for getting service status
 */
export const getServiceStatus = (req: Request, res: Response): void => {
  try {
    // Simple status endpoint (similar to health check but with more details)
    const status = {
      service: 'email-service',
      status: 'SERVING',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      mode: process.env.EMAIL_SERVICE_MODE || 'dummy'
    };
    
    res.status(200).json(status);
  } catch (error) {
    globalErrorHandler(error as Error, res);
  }
};