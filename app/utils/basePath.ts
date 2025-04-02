/**
 * Utility function to get the correct basePath for static assets
 * This adjusts paths for GitHub Pages deployment
 */
export const getBasePath = () => {
  return process.env.NODE_ENV === 'production' ? '/portfolio-website' : '';
};

/**
 * Helper to create full URLs for static assets
 */
export const getAssetPath = (path: string) => {
  if (path.startsWith('http')) return path;
  return `${getBasePath()}${path}`;
}; 