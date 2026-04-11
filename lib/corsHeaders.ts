// lib/corsHeaders.ts
const ALLOWED_ORIGINS = [
  'https://burnboxadvertising.com',
  'https://www.burnboxadvertising.com',
  'https://burnbox.vercel.app',
  'http://localhost:3000',
];

const DEFAULT_ORIGIN = 'https://burnboxadvertising.com';

export function getCorsHeaders(origin?: string | null) {
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : DEFAULT_ORIGIN;

  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
    Vary: 'Origin',
  };
}

export const corsHeaders = getCorsHeaders(DEFAULT_ORIGIN);
  
  
  
  
  
  