// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory store (use Redis for production)
const rateLimitMap = new Map<string, { count: number; lastRequest: number; blockedUntil?: number }>();

export function middleware(request: NextRequest) {
  // Get client IP from headers
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0]?.trim() || realIp || 'unknown';

  // Only apply to send-email endpoint
  if (request.nextUrl.pathname === '/api/send-email') {
    // Security headers for API responses
    const securityHeaders = {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
    };

    // Check if IP is temporarily blocked
    const now = Date.now();
    const blockedEntry = rateLimitMap.get(ip);
    
    if (blockedEntry?.blockedUntil && now < blockedEntry.blockedUntil) {
      return NextResponse.json(
        { 
          message: 'Too many requests. Your IP has been temporarily blocked.',
          retryAfter: Math.ceil((blockedEntry.blockedUntil - now) / 1000)
        },
        {   
          status: 429,
          headers: securityHeaders
        }
      );
    }
    // Rate limiting configuration
    const MAX_REQUESTS = 5; // Max requests per window
    const WINDOW_MS = 60 * 1000; // 1 minute window
    const BLOCK_TIME = 15 * 60 * 1000; // 15 minutes block if exceeded

    const windowStart = now - WINDOW_MS;

    // Clean up old entries periodically
    if (Math.random() < 0.1) { // 10% chance to clean up
      rateLimitMap.forEach((value, key) => {
        if (value.lastRequest < windowStart && (!value.blockedUntil || value.blockedUntil < now)) {
          rateLimitMap.delete(key);
        }
      });
    }

    // Get or create rate limit entry
    let rateLimit = rateLimitMap.get(ip) || { count: 0, lastRequest: now };

    // Reset count if outside current window
    if (rateLimit.lastRequest < windowStart) {
      rateLimit.count = 0;
    }

    // Check rate limit
    if (rateLimit.count >= MAX_REQUESTS) {
      // Block the IP for BLOCK_TIME
      rateLimit.blockedUntil = now + BLOCK_TIME;
      rateLimitMap.set(ip, rateLimit);

      return NextResponse.json(
        { 
          message: 'Too many requests. Your IP has been temporarily blocked.',
          retryAfter: Math.ceil(BLOCK_TIME / 1000)
        },
        { 
          status: 429,
          headers: securityHeaders
        }
      );
    }

    // Update rate limit
    rateLimit.count++;
    rateLimit.lastRequest = now;
    rateLimitMap.set(ip, rateLimit);

    // Create response with security headers
    const response = NextResponse.next();
    
    // Add security headers
    Object.entries(securityHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    
    // Add rate limit headers
    response.headers.set('X-RateLimit-Limit', MAX_REQUESTS.toString());
    response.headers.set('X-RateLimit-Remaining', (MAX_REQUESTS - rateLimit.count).toString());
    response.headers.set('X-RateLimit-Reset', Math.ceil((now + WINDOW_MS) / 1000).toString());

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/api/send-email',
};