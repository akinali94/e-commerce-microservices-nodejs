export class CreditCardError extends Error {
  code: number;
  constructor(message: string) {
    super(message);
    this.code = 400;
  }
}

export class InvalidCreditCard extends CreditCardError {
  constructor() {
    super('Credit card info is invalid');
  }
}

export class UnacceptedCreditCard extends CreditCardError {
  constructor(cardType: string) {
    super(`Sorry, we cannot process ${cardType} credit cards. Only VISA or MasterCard is accepted.`);
  }
}

export class ExpiredCreditCard extends CreditCardError {
  constructor(number: string, month: number, year: number) {
    super(`Your credit card (ending ${number.slice(-4)}) expired on ${month}/${year}`);
  }
}