declare module 'simple-card-validator' {
  type CardType = 'visa' | 'mastercard' | string;

  interface CardDetails {
    cardType: CardType;
    valid: boolean;
  }

  interface CardInfo {
    getCardDetails(): CardDetails;
  }

  function validator(cardNumber: string): CardInfo;
  export = validator;
}