import cardValidator from 'simple-card-validator';
import { v4 as uuidv4 } from 'uuid';
import { logger } from './utils/logger';
import type { Amount, CreditCard, ChargeResult } from './types/payment';
import { InvalidCreditCard, UnacceptedCreditCard, ExpiredCreditCard } from './types/errors'

export async function charge(amount: Amount, creditCard: CreditCard): Promise<ChargeResult> {
  const cardNumber = creditCard.cardNo;
  const cardInfo = cardValidator(cardNumber);
  const { cardType: cardType, valid } = cardInfo.getCardDetails();

  if (!valid) throw new InvalidCreditCard();

  if (!(cardType === 'visa' || cardType === 'mastercard')) {
    throw new UnacceptedCreditCard(cardType);
  }

  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();
  const { expirationYear: year, expirationMonth: month } = creditCard;

  if ((currentYear * 12 + currentMonth) > (year * 12 + month)) {
    throw new ExpiredCreditCard(cardNumber.replace(/-/g, ''), month, year);
  }

  logger.info(
    `Transaction processed: ${cardType} ending ${cardNumber.slice(-4)} Amount: ${amount.currencyCode}${amount.units}.${amount.nanos}`
  );

  return { transactionId: uuidv4() };
}
