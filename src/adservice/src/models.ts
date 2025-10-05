export interface Ad {
  redirectUrl: string;
  text: string;
}

export enum AdCategory {
  CLOTHING = 'clothing',
  ACCESSORIES = 'accessories',
  FOOTWEAR = 'footwear',
  HAIR = 'hair',
  DECOR = 'decor',
  KITCHEN = 'kitchen',
}

export interface AdRequest {
  contextKeys?: string[];
}

export interface AdResponse {
  ads: Ad[];
}

export const createAdRequest = (contextKeys?: string[]): AdRequest => {
  return {
    ...(contextKeys && contextKeys.length > 0 && { contextKeys }),
  };
};


export const createAdResponse = (ads: Ad[]): AdResponse => {
  return { ads };
};


export const createAd = (redirectUrl: string, text: string): Ad => {
  return { redirectUrl, text };
};