import { Ad, AdCategory, createAd } from './models';

/**
 * In-memory ad database organized by category
 */
const adDatabase: Map<AdCategory, Ad[]> = new Map([
  [
    AdCategory.CLOTHING,
    [
      createAd('/product/66VCHSJNUP', 'Tank top for sale. 20% off.'),
    ],
  ],
  [
    AdCategory.ACCESSORIES,
    [
      createAd('/product/1YMWWN1N4O', 'Watch for sale. Buy one, get second kit for free'),
    ],
  ],
  [
    AdCategory.FOOTWEAR,
    [
      createAd('/product/L9ECAV7KIM', 'Loafers for sale. Buy one, get second one for free'),
    ],
  ],
  [
    AdCategory.HAIR,
    [
      createAd('/product/2ZYFJ3GM2N', 'Hairdryer for sale. 50% off.'),
    ],
  ],
  [
    AdCategory.DECOR,
    [
      createAd('/product/0PUK6V6EV0', 'Candle holder for sale. 30% off.'),
    ],
  ],
  [
    AdCategory.KITCHEN,
    [
      createAd('/product/9SIQT8TOJO', 'Bamboo glass jar for sale. 10% off.'),
      createAd('/product/6E92ZMYYFZ', 'Mug for sale. Buy two, get third one for free'),
    ],
  ],
]);

/**
 * Configuration for ad serving
 */
const AD_CONFIG = {
  MAX_ADS_TO_SERVE: 2,
} as const;

/**
 * Gets all ads from the database (flattened)
 */
export const getAllAds = (): Ad[] => {
  const allAds: Ad[] = [];
  adDatabase.forEach((ads) => {
    allAds.push(...ads);
  });
  return allAds;
};

/**
 * Gets ads by a specific category
 */
export const getAdsByCategory = (category: string): Ad[] => {
  const categoryKey = category.toLowerCase() as AdCategory;
  return adDatabase.get(categoryKey) || [];
};

/**
 * Gets ads by multiple categories
 */
export const getAdsByCategories = (categories: string[]): Ad[] => {
  const ads: Ad[] = [];
  
  categories.forEach((category) => {
    const categoryAds = getAdsByCategory(category);
    ads.push(...categoryAds);
  });
  
  return ads;
};

/**
 * Gets random ads from the database
 */
export const getRandomAds = (count: number = AD_CONFIG.MAX_ADS_TO_SERVE): Ad[] => {
  const allAds = getAllAds();
  const selectedAds: Ad[] = [];
  
  // If we don't have enough ads, return all
  if (allAds.length <= count) {
    return [...allAds];
  }
  
  // Select random ads
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * allAds.length);
    selectedAds.push(allAds[randomIndex]);
  }
  
  return selectedAds;
};

/**
 * Checks if a category exists in the database
 * @param category - Category string to check
 * @returns true if category exists, false otherwise
 */
export const categoryExists = (category: string): boolean => {
  const categoryKey = category.toLowerCase() as AdCategory;
  return adDatabase.has(categoryKey);
};

/**
 * Gets the total count of ads in the database
 */
export const getAdCount = (): number => {
  return getAllAds().length;
};

/**
 * Gets all available categories
 */
export const getAllCategories = (): string[] => {
  return Array.from(adDatabase.keys());
};