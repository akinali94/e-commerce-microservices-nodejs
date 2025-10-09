import { Money } from "../types.js";

const NANOS_MIN = -999999999;
const NANOS_MAX = 999999999;
const NANOS_MOD = 1000000000;

export class MoneyError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MoneyError";
  }
}

export const ErrInvalidValue = new MoneyError("one of the specified money values is invalid");
export const ErrMismatchingCurrency = new MoneyError("mismatching currency codes");

function signMatches(m: Money): boolean {
  return m.nanos === 0 || m.units === 0 || (m.nanos < 0) === (m.units < 0);
}

function validNanos(nanos: number): boolean {
  return NANOS_MIN <= nanos && nanos <= NANOS_MAX;
}

export function isValid(m: Money): boolean {
  return signMatches(m) && validNanos(m.nanos);
}

export function isZero(m: Money): boolean {
  return m.units === 0 && m.nanos === 0;
}

export function isPositive(m: Money): boolean {
  return isValid(m) && (m.units > 0 || (m.units === 0 && m.nanos > 0));
}

export function isNegative(m: Money): boolean {
  return isValid(m) && (m.units < 0 || (m.units === 0 && m.nanos < 0));
}

export function areSameCurrency(l: Money, r: Money): boolean {
  return l.currencyCode === r.currencyCode && l.currencyCode !== "";
}

export function areEquals(l: Money, r: Money): boolean {
  return (
    l.currencyCode === r.currencyCode &&
    l.units === r.units &&
    l.nanos === r.nanos
  );
}

export function negate(m: Money): Money {
  return {
    units: -m.units,
    nanos: -m.nanos,
    currencyCode: m.currencyCode,
  };
}

export function sum(l: Money, r: Money): Money {
  if (!isValid(l) || !isValid(r)) {
    throw ErrInvalidValue;
  }
  if (l.currencyCode !== r.currencyCode) {
    throw ErrMismatchingCurrency;
  }

  let units = l.units + r.units;
  let nanos = l.nanos + r.nanos;

  if ((units === 0 && nanos === 0) || (units > 0 && nanos >= 0) || (units < 0 && nanos <= 0)) {
    // same sign <units, nanos>
    units += Math.floor(nanos / NANOS_MOD);
    nanos = nanos % NANOS_MOD;
  } else {
    // different sign. nanos guaranteed to not go over the limit
    if (units > 0) {
      units--;
      nanos += NANOS_MOD;
    } else {
      units++;
      nanos -= NANOS_MOD;
    }
  }

  return {
    units,
    nanos,
    currencyCode: l.currencyCode,
  };
}

export function multiplySlow(m: Money, n: number): Money {
  let out = m;
  for (let i = 1; i < n; i++) {
    out = sum(out, m);
  }
  return out;
}

export function must(m: Money): Money {
  return m;
}