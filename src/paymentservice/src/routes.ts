import { Router } from 'express';
import { chargeCard, healthCheck } from './controllers';

const router = Router();

router.post('/charge', chargeCard);
router.get('/health', healthCheck);

export default router;
