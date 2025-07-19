interface Config {
  API_URL: string;
  PRODUCTION: boolean;
  AT_GOOGLE_CLIENT_ID: string;
  [key: string]: any;
}

const config: Config = {
  API_URL: window.AT_API_URL || 'http://localhost:8080',
  PRODUCTION: window.AT_PRODUCTION || false,
  API_PRODUCTS: window.AT_API_PRODUCTS || 'http://localhost:8080',
  AT_GOOGLE_CLIENT_ID: window.AT_GOOGLE_CLIENT_ID || '',
  AT_GOOGLE_CLIENT_SECRET: window.AT_GOOGLE_CLIENT_SECRET || '',
};

export default config; 