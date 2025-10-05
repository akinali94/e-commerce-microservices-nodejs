import { Router } from 'express';
import {
  getQuoteController,
  shipOrderController,
  healthCheckController
} from './controller';

const router = Router();

// Root health check
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    service: 'shipping-service',
    timestamp: new Date().toISOString()
  });
});

// Shipping routes
router.post('/shipping/quote', getQuoteController);
router.post('/shipping/ship', shipOrderController);
router.get('/shipping/health', healthCheckController);

export default router;