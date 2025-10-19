
import { Router } from 'express';
import * as controller from './controller';

const router = Router();

// Route for sending order confirmation emails
router.post('/send-order-confirmation', controller.sendOrderConfirmation);

// Route to check email service status (additional route for monitoring)
router.get('/status', controller.getServiceStatus);

export { router };