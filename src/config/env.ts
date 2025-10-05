// Environment configuration
export const config = {
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Unitrux Admin',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    environment: import.meta.env.VITE_APP_ENV || 'development',
  },
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://unitrux-api.up.railway.app/api',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000'),
  },
  build: {
    sourcemap: import.meta.env.VITE_BUILD_SOURCEMAP === 'true',
    minify: import.meta.env.VITE_BUILD_MINIFY !== 'false',
  },
  security: {
    secretKey: import.meta.env.VITE_APP_SECRET_KEY || 'default-secret-key',
  },
} as const;

export default config;
