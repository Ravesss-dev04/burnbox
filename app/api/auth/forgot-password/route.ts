import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { corsHeaders } from '@/lib/corsHeaders';
import nodemailer from 'nodemailer';

const TOKEN_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const RESET_TOKEN_TTL_SECONDS = 60 * 60;

interface ResetTokenPayload {
  sub: string;
  email: string;
  marker: string;
  exp: number;
}

const prisma = new PrismaClient();


export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}


export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400, headers: corsHeaders }
      );
    }

    const users = await prisma.$queryRaw<Array<{ id: number; email: string | null; password: string | null; name: string | null }>>`
      SELECT id, email, password, name
      FROM \`user\`
      WHERE LOWER(email) = ${normalizedEmail}
      LIMIT 1
    `;

    const user = users[0];

    if (!user) {
      return NextResponse.json({
        error: 'Email does not exist'
      },
      { status: 404, headers: corsHeaders }
    );
    }

    if (!user.email || !user.password) {
      return NextResponse.json(
        { error: 'This account cannot reset password right now' },
        { status: 400, headers: corsHeaders }
      );
    }

    const marker = crypto.createHmac('sha256', TOKEN_SECRET).update(user.password).digest('base64url');
    const resetToken = createResetToken({
      sub: String(user.id),
      email: user.email,
      marker,
      exp: Math.floor(Date.now() / 1000) + RESET_TOKEN_TTL_SECONDS,
    });

    const resetUrl = `${getAppBaseUrl(request)}/admin?token=${encodeURIComponent(resetToken)}`;
    await sendResetPasswordEmail(user.email, user.name, resetUrl);

    return NextResponse.json({
      message: 'Reset link sent to your email.'
    },
    {headers: corsHeaders}
  );

  } catch (error) {
    console.error('Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}

function getAppBaseUrl(request: NextRequest): string {
  const forwardedHost = request.headers.get('x-forwarded-host');
  const forwardedProto = request.headers.get('x-forwarded-proto');
  if (forwardedHost) {
    return `${forwardedProto || 'https'}://${forwardedHost}`.replace(/\/$/, '');
  }

  const requestOrigin = request.nextUrl?.origin;
  if (requestOrigin) {
    return requestOrigin.replace(/\/$/, '');
  }

  const host = request.headers.get('host');
  if (host) {
    const isLocal = host.includes('localhost') || host.startsWith('127.0.0.1');
    const protocol = isLocal ? 'http' : 'https';
    return `${protocol}://${host}`.replace(/\/$/, '');
  }

  return (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');
}

function createResetToken(payload: ResetTokenPayload): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const unsigned = `${header}.${encodedPayload}`;
  const signature = crypto.createHmac('sha256', TOKEN_SECRET).update(unsigned).digest('base64url');
  return `${unsigned}.${signature}`;
}

async function sendResetPasswordEmail(email: string, name: string | null, resetUrl: string) {
  const smtpHost = process.env.EMAIL_HOST;
  const smtpPort = Number(process.env.EMAIL_PORT || '0');
  const smtpUser = process.env.EMAIL_USER;
  const smtpPass = process.env.EMAIL_PASS;
  const fromAddress = process.env.BUSINESS_EMAIL || smtpUser;

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !fromAddress) {
    throw new Error('Email service is not configured');
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const displayName = name?.trim() || email;

  await transporter.sendMail({
    from: `"Burnbox Team" <${fromAddress}>`,
    to: email,
    subject: 'Reset Your Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
        <h2 style="margin-bottom: 8px;">Password Reset Request</h2>
        <p>Hi <strong>${displayName}</strong>,</p>
        <p>We received a request to reset your password.</p>
        <p>
          <a href="${resetUrl}" style="display: inline-block; background: #f43c6d; color: #fff; text-decoration: none; padding: 12px 18px; border-radius: 8px; font-weight: 700;">
            Reset Password
          </a>
        </p>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not request this change, you can ignore this email.</p>
      </div>
    `,
  });
}




