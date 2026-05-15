/**
 * Utility function to get the correct basePath for static assets.
 * Mirrors the basePath condition in next.config.ts:
 *   - empty string in dev so http://localhost:3000/ works
 *   - '/portfolio-website' in production for GitHub Pages deploy
 */
export const getBasePath = () => {
  return process.env.NODE_ENV === 'production' ? '/portfolio-website' : '';
};

/**
 * Helper to create full URLs for static assets.
 */
export const getAssetPath = (path: string) => {
  if (path.startsWith('http')) return path;
  return `${getBasePath()}${path}`;
};
