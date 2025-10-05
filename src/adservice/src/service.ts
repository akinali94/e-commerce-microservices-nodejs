
import { Ad, AdRequest, AdResponse, createAdResponse } from './models';
import { validateAdRequest } from './validators';
import { InvalidRequestError } from './errors';
import { getAdsByCategories, getRandomAds } from './repository';

/**
 * Core business logic for getting ads based on context keys
 * This implements the same logic as the Java AdServiceImpl.getAds()
 * 
 * Logic flow:
 * 1. If context keys provided -> get ads by those categories
 * 2. If no context keys OR no matching ads -> return random ads
 * 
 * @param request - AdRequestDto containing optional context keys
 * @returns AdResponseDto containing relevant ads
 * @throws InvalidRequestError if request is invalid
 */
export const getAds = (request: AdRequest): AdResponse => {
  // Validate request
  if (!validateAdRequest(request)) {
    throw new InvalidRequestError('Invalid ad request format');
  }

  let ads: Ad[] = [];

  // If context keys are provided, try to get ads by categories
  if (request.contextKeys && request.contextKeys.length > 0) {
    ads = getAdsByCategories(request.contextKeys);
  }

  // If no ads found or no context keys provided, return random ads
  if (ads.length === 0) {
    ads = getRandomAds();
  }

  return createAdResponse(ads);
};

/**
 * Gets ads with detailed logging (useful for debugging)
 * @param request - AdRequestDto containing optional context keys
 * @param logger - Optional logger function
 * @returns AdResponseDto containing relevant ads
 */
export const getAdsWithLogging = (
  request: AdRequest,
  logger?: (message: string) => void
): AdResponse => {
  const log = logger || console.log;

  log(
    `Received ad request with context keys: ${
      request.contextKeys?.join(', ') || 'none'
    }`
  );

  const response = getAds(request);

  log(`Returning ${response.ads.length} ads`);

  return response;
};

/**
 * Gets random ads directly (without context)
 * @param count - Optional number of ads to return
 * @returns AdResponseDto containing random ads
 */
export const getRandomAdsResponse = (count?: number): AdResponse => {
  const ads = getRandomAds(count);
  return createAdResponse(ads);
};