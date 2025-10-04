
/**
 * Seeded random state
 */
let seeded = false;

/**
 * Generates a tracking ID based on address
 * Format: XX-<length><3digits>-<length/2><7digits>
 * Example: AB-15234-71234567
 */
export const createTrackingId = (salt: string): string => {
  // Seed random number generator on first call
  if (!seeded) {
    // In Node.js, Math.random() is already seeded
    seeded = true;
  }

  const letter1 = getRandomLetterCode();
  const letter2 = getRandomLetterCode();
  const length = salt.length;
  const random3 = getRandomNumber(3);
  const halfLength = Math.floor(length / 2);
  const random7 = getRandomNumber(7);

  return `${letter1}${letter2}-${length}${random3}-${halfLength}${random7}`;
};

/**
 * Generates a random capital letter (A-Z)
 */
const getRandomLetterCode = (): string => {
  const code = 65 + Math.floor(Math.random() * 26);
  return String.fromCharCode(code);
};

/**
 * Generates a random number string with specified digits
 */
const getRandomNumber = (digits: number): string => {
  let str = '';
  for (let i = 0; i < digits; i++) {
    str += Math.floor(Math.random() * 10);
  }
  return str;
};

/**
 * Formats an address as a base string for tracking ID generation
 */
export const formatAddressForTracking = (address: {
  streetAddress: string;
  city: string;
  state: string;
}): string => {
  return `${address.streetAddress}, ${address.city}, ${address.state}`;
};