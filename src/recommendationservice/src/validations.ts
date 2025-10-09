export const validateListRecommendationsRequest = (
  body: any
): { valid: boolean; error?: string } => {
  if (!body.userId || typeof body.userId !== 'string') {
    return { valid: false, error: 'userId is required and must be a string' };
  }

  if (!Array.isArray(body.productIds)) {
    return { valid: false, error: 'productIds must be an array' };
  }

  if (!body.productIds.every((id: any) => typeof id === 'string')) {
    return { valid: false, error: 'all productIds must be strings' };
  }

  return { valid: true };
};