import { Ad, AdCategory, AdRequest,  } from "./models"; 

export const isValidAdCategory = (category: string): category is AdCategory => {
  return Object.values(AdCategory).includes(category as AdCategory);
};

/**
 * Validates an AdRequestDto
 */
export const validateAdRequest = (data: unknown): data is AdRequest => {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const req = data as AdRequest;

  // contextKeys is optional, but if present must be an array of strings
  if (req.contextKeys !== undefined) {
    if (!Array.isArray(req.contextKeys)) {
      return false;
    }
    if (!req.contextKeys.every((key) => typeof key === 'string')) {
      return false;
    }
  }

  return true;
};

/**
 * Validates an Ad object
 */
export const validateAd = (data: unknown): data is Ad => {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const ad = data as Ad;

  return (
    typeof ad.redirectUrl === 'string' &&
    typeof ad.text === 'string'
  );
};