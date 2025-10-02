import { Request, Response } from 'express';
import * as paymentService from './service';
import { CreditCardError } from './types/errors'
import { logger } from './utils/logger';
import type { Amount, CreditCard } from './types/payment';

export async function chargeCard(req: Request, res: Response) {
  try {
    const { amount, creditCard } = req.body as { amount?: Amount; creditCard?: CreditCard };

    logger.info(`Payment charge request: ${JSON.stringify(req.body)}`);

    if (!amount || !creditCard) {
      return res.status(400).json({ error: 'Missing required fields: amount and credit_card' });
    }

    if (
      !creditCard.cardNo ||
      !creditCard.cvv ||
      !creditCard.expirationYear ||
      !creditCard.expirationMonth
    ) {
      return res.status(400).json({ error: 'Missing required credit card fields' });
    }

    const result = await paymentService.charge(amount, creditCard);
    return res.status(200).json(result);
  } catch (error) {
    logger.error({ err: error }, 'Payment charge error');

    if (error instanceof CreditCardError) {
      return res.status(error.code).json({ error: error.message });
    }

    return res.status(500).json({ error: 'Internal server error' });
  }
}

export function healthCheck(_req: Request, res: Response) {
  res.status(200).json({ status: 'SERVING', service: 'PaymentService' });
}
