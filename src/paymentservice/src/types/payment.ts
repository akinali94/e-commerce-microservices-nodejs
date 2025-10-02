

export interface Amount {
  currencyCode: string;
  units: number;
  nanos: number;
}

export interface CreditCard {
  cardNo: string;
  cvv: string;
  expirationYear: number;
  expirationMonth: number;
}

export interface ChargeResult {
  transactionId: string;
}