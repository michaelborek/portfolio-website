/**
 * Utility function to get the correct basePath for static assets
 * This should match the basePath set in next.config.ts
 */
export const getBasePath = () => {
  // Always return the basePath since it's configured in next.config.ts
  // This ensures consistency between development and production
  return '/portfolio-website';
};

/**
 * Helper to create full URLs for static assets
 */
export const getAssetPath = (path: string) => {
  if (path.startsWith('http')) return path;
  return `${getBasePath()}${path}`;
}; 