// src/service.ts
import fs from 'fs/promises';
import path from 'path';
import Handlebars from 'handlebars';
import { Order } from './types';
import { logger } from './utils/logger';
import { createError, ErrorTypes } from './utils/errorhandler';

// Service configuration
const isDummyMode = process.env.EMAIL_SERVICE_MODE === 'dummy';
const TEMPLATES_DIR = path.join(__dirname, 'templates');

/**
 * Send order confirmation email
 * @param email - recipient email address
 * @param order - order details
 */
export const sendOrderConfirmation = async (email: string, order: Order): Promise<void> => {
  try {
    // Validate inputs
    if (!email || !email.includes('@')) {
      throw createError(ErrorTypes.VALIDATION_ERROR, 'Invalid email address');
    }
    
    if (!order || !order.orderId) {
      throw createError(ErrorTypes.VALIDATION_ERROR, 'Invalid order details');
    }
    
    if (isDummyMode) {
      // Dummy mode - just log the request (similar to DummyEmailService in the original)
      logger.info(`[DUMMY MODE] Order confirmation email would be sent to ${email}`, {
        email,
        orderId: order.orderId
      });
      return;
    }

    // Render the email template
    try {
      const emailContent = await renderConfirmationEmail(order);
      
      // In a real implementation, we would send the email here
      // For now, we'll just log that we would send it
      logger.info(`Would send email to ${email} with order confirmation for order #${order.orderId}`);
      
      // TODO: Implement actual email sending logic (AWS SES, for example)
    } catch (templateError) {
      throw createError(
        ErrorTypes.TEMPLATE_ERROR, 
        `Failed to render email template: ${(templateError as Error).message}`
      );
    }
  } catch (error) {
    logger.error('Error in sendOrderConfirmation', { 
      error: (error as Error).message,
      email,
      orderId: order?.orderId
    });
    throw error; // Re-throw to be handled by the controller
  }
};

/**
 * Load a template file from the templates directory
 * @param templateName - name of the template file
 */
const loadTemplate = async (templateName: string): Promise<string> => {
  try {
    const templatePath = path.join(TEMPLATES_DIR, templateName);
    const template = await fs.readFile(templatePath, 'utf-8');
    
    if (!template) {
      throw createError(ErrorTypes.TEMPLATE_ERROR, `Template ${templateName} not found or empty`);
    }
    
    return template;
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      throw createError(ErrorTypes.NOT_FOUND, `Template file ${templateName} not found`);
    }
    
    throw createError(
      ErrorTypes.TEMPLATE_ERROR, 
      `Error loading template ${templateName}: ${(error as Error).message}`
    );
  }
};

/**
 * Render the confirmation email template with order details
 * @param order - order details to include in the email
 */
const renderConfirmationEmail = async (order: Order): Promise<string> => {
  try {
    // Load the template from file
    const templateString = await loadTemplate('confirmation.html');
    
    // Register a helper to format nanos similar to the original template
    Handlebars.registerHelper('formatNanos', function(nanos) {
      return String(Math.floor(nanos / 10000000)).padStart(2, '0');
    });
    
    // Compile the template
    const template = Handlebars.compile(templateString);
    
    // Render the template with the order data
    return template(order);
  } catch (error) {
    logger.error('Error rendering confirmation email', { 
      error: (error as Error).message,
      orderId: order.orderId
    });
    throw error;
  }
};