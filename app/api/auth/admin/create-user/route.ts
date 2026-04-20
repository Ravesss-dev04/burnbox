import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hashPassword, verifyToken } from '@/lib/auth-utils';
import { getCorsHeaders } from '@/lib/corsHeaders';
import { createHmac, randomBytes, timingSafeEqual } from 'crypto';
import nodemailer from 'nodemailer';

const prisma = new PrismaClient();
const TOKEN_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const INVITATION_TTL_SECONDS = 24 * 60 * 60;

interface InvitationTokenPayload {
  sub: string;
  email: string;
  passwordHash: string;
  exp: number;
}

function getAppBaseUrl(request: NextRequest): string {
  const forwardedHost = request.headers.get('x-forwarded-host');
  const forwardedProto = request.headers.get('x-forwarded-proto');
  if (forwardedHost) {
    const proto = forwardedProto || 'https';
    return `${proto}://${forwardedHost}`.replace(/\/$/, '');
  }

  const requestOrigin = request.nextUrl?.origin;
  if (requestOrigin) {
    return requestOrigin.replace(/\/$/, '');
  }

  const host = request.headers.get('host');
  if (host) {
    const isLocal = host.includes('localhost') || host.startsWith('127.0.0.1');
    const proto = isLocal ? 'http' : 'https';
    return `${proto}://${host}`.replace(/\/$/, '');
  }

  return (process.env.NEXT_PUBLIC_APP_URL || request.headers.get('origin') || 'http://localhost:3000').replace(/\/$/, '');
}

function createInvitationToken(payload: InvitationTokenPayload): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const unsigned = `${header}.${encodedPayload}`;
  const signature = createHmac('sha256', TOKEN_SECRET).update(unsigned).digest('base64url');
  return `${unsigned}.${signature}`;
}

function verifyInvitationToken(token: string): InvitationTokenPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [header, encodedPayload, signature] = parts;
    const unsigned = `${header}.${encodedPayload}`;
    const expectedSignature = createHmac('sha256', TOKEN_SECRET).update(unsigned).digest('base64url');

    const signatureBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);
    if (
      signatureBuffer.length !== expectedBuffer.length ||
      !timingSafeEqual(signatureBuffer, expectedBuffer)
    ) {
      return null;
    }

    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8')) as InvitationTokenPayload;
    if (!payload?.sub || !payload?.email || !payload?.passwordHash || !payload?.exp) {
      return null;
    }
    if (Date.now() > payload.exp * 1000) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

function invitationPageHtml({
  title,
  message,
  buttonLabel,
  buttonHref,
  autoRedirectTo,
  autoRedirectMs,
}: {
  title: string;
  message: string;
  buttonLabel: string;
  buttonHref: string;
  autoRedirectTo?: string;
  autoRedirectMs?: number;
}) {
  const shouldAutoRedirect = Boolean(autoRedirectTo && autoRedirectMs && autoRedirectMs > 0);
  const countdownSeconds = shouldAutoRedirect ? Math.ceil((autoRedirectMs as number) / 1000) : 0;

  return `<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
    <style>
      body { font-family: Arial, sans-serif; background: #0b0b0c; color: #ffffff; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
      .card { width: min(92vw, 520px); background: #151519; border: 1px solid #2a2a31; border-radius: 14px; padding: 28px; box-shadow: 0 20px 60px rgba(0,0,0,0.4); }
      h1 { margin: 0 0 12px; font-size: 24px; }
      p { margin: 0 0 20px; color: #c4c4cd; line-height: 1.55; }
      a { display: inline-block; text-decoration: none; background: #f43c6d; color: #fff; padding: 12px 16px; border-radius: 10px; font-weight: 700; }
      small { display: block; margin-top: 14px; color: #9da0ad; }
    </style>
  </head>
  <body>
    <main class="card">
      <h1>${title}</h1>
      <p>${message}</p>
      <a href="${buttonHref}">${buttonLabel}</a>
      ${shouldAutoRedirect ? `<small>Redirecting automatically in ${countdownSeconds} seconds...</small>` : ''}
    </main>
    ${shouldAutoRedirect ? `<script>setTimeout(function(){ window.location.href = ${JSON.stringify(autoRedirectTo)}; }, ${autoRedirectMs});</script>` : ''}
  </body>
</html>`;
}

async function sendInvitationEmail(params: {
  email: string;
  name: string | null;
  role: 'ADMIN' | 'STAFF';
  position: string;
  inviteUrl: string;
}) {
  const smtpHost = process.env.EMAIL_HOST;
  const smtpPort = Number(process.env.EMAIL_PORT || '0');
  const smtpUser = process.env.EMAIL_USER;
  const smtpPass = process.env.EMAIL_PASS;
  const fromAddress = process.env.BUSINESS_EMAIL || smtpUser;

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !fromAddress) {
    throw new Error('Email service is not configured. Please set EMAIL_HOST, EMAIL_PORT, EMAIL_USER, and EMAIL_PASS.');
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

  const displayName = params.name?.trim() || params.email;

  await transporter.sendMail({
    from: `"Burnbox Team" <${fromAddress}>`,
    to: params.email,
    subject: 'Burnbox Admin Invitation - Verify Your Email',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #111;">
        <h2 style="margin-bottom: 8px;">Welcome to Burnbox Admin</h2>
        <p>Hi <strong>${displayName}</strong>,</p>
        <p>You have been invited to access the Burnbox admin dashboard.</p>
        <p><strong>Role:</strong> ${params.role}<br/><strong>Position:</strong> ${params.position}</p>
        <p>Verify your email to activate your account:</p>
        <p>
          <a href="${params.inviteUrl}" style="display: inline-block; background: #f43c6d; color: white; text-decoration: none; padding: 12px 20px; border-radius: 8px; font-weight: 700;">
            Verify Invitation
          </a>
        </p>
        <p>This invitation link expires in 24 hours.</p>
      </div>
    `,
  });
}

export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, { headers: getCorsHeaders(request.headers.get('origin')) });
}

export async function GET(request: NextRequest) {
  const headers = getCorsHeaders(request.headers.get('origin'));
  const appBaseUrl = getAppBaseUrl(request);

  try {
    const token = new URL(request.url).searchParams.get('token');
    if (!token) {
      return new NextResponse(
        invitationPageHtml({
          title: 'Invitation token missing',
          message: 'The verification link is incomplete. Please request a new invitation from your admin.',
          buttonLabel: 'Go to Login',
          buttonHref: `${appBaseUrl}/admin`,
        }),
        { status: 400, headers: { ...headers, 'Content-Type': 'text/html; charset=utf-8' } }
      );
    }

    const payload = verifyInvitationToken(token);
    if (!payload) {
      return new NextResponse(
        invitationPageHtml({
          title: 'Invitation expired or invalid',
          message: 'This invitation is no longer valid. Please ask an admin to resend your invite.',
          buttonLabel: 'Go to Login',
          buttonHref: `${appBaseUrl}/admin`,
        }),
        { status: 400, headers: { ...headers, 'Content-Type': 'text/html; charset=utf-8' } }
      );
    }

    const userId = Number(payload.sub);
    if (!Number.isFinite(userId)) {
      return new NextResponse(
        invitationPageHtml({
          title: 'Invalid invitation',
          message: 'This invitation cannot be processed. Please request a new link from your admin.',
          buttonLabel: 'Go to Login',
          buttonHref: `${appBaseUrl}/admin`,
        }),
        { status: 400, headers: { ...headers, 'Content-Type': 'text/html; charset=utf-8' } }
      );
    }

    const existingUser = await prisma.user.findUnique({ where: { id: userId } });
    if (!existingUser || existingUser.email !== payload.email) {
      return new NextResponse(
        invitationPageHtml({
          title: 'Account not found',
          message: 'This account is unavailable. Contact your admin for a new invitation.',
          buttonLabel: 'Go to Login',
          buttonHref: `${appBaseUrl}/admin`,
        }),
        { status: 404, headers: { ...headers, 'Content-Type': 'text/html; charset=utf-8' } }
      );
    }

    await prisma.user.update({
      where: { id: userId },
      data: ({ password: payload.passwordHash } as any),
    });

    return new NextResponse(
      invitationPageHtml({
        title: 'You have successfully verified your email',
        message: 'Your account is now active and connected. You can now log in to the admin dashboard using your invited credentials.',
        buttonLabel: 'Go to Admin Login',
        buttonHref: `${appBaseUrl}/admin`,
        autoRedirectTo: `${appBaseUrl}/admin`,
        autoRedirectMs: 2500,
      }),
      { status: 200, headers: { ...headers, 'Content-Type': 'text/html; charset=utf-8' } }
    );
  } catch (error) {
    console.error('Admin invitation verification error:', error);
    return new NextResponse(
      invitationPageHtml({
        title: 'Verification failed',
        message: 'An internal error occurred while verifying your invitation. Please try again later.',
        buttonLabel: 'Go to Login',
        buttonHref: `${appBaseUrl}/admin`,
      }),
      { status: 500, headers: { ...headers, 'Content-Type': 'text/html; charset=utf-8' } }
    );
  }
}

export async function POST(request: NextRequest) {
  const headers = getCorsHeaders(request.headers.get('origin'));

  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers });
    }

    // Decode token (supports JWT from auth-utils or HMAC token used in login route)
    let decoded: any = null;
    try {
      // Try standard JWT first
      decoded = verifyToken(token);
    } catch (e) {
      // Fallback: parse custom HMAC token `header.payload.signature` and read `sub`
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          const payloadStr = Buffer.from(parts[1], 'base64url').toString('utf8');
          decoded = JSON.parse(payloadStr);
        }
      } catch {}
    }
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401, headers });
    }

    const requesterId = decoded.userId ?? decoded.sub;
    if (!requesterId) {
      return NextResponse.json({ error: 'Invalid token payload' }, { status: 401, headers });
    }
    const adminUser = await prisma.user.findUnique({ where: { id: Number(requesterId) } });
    const hasAdmin = await prisma.user.count({ where: { role: 'ADMIN' as any } });
    // Allow bootstrap: if there is no ADMIN yet, permit this request to create the first admin
    const isBootstrapMode = hasAdmin === 0;
    if (!isBootstrapMode) {
      if (!adminUser || (adminUser as any).role !== 'ADMIN') {
        return NextResponse.json({ error: 'Forbidden: admin role required' }, { status: 403, headers });
      }
    }

    const { email, password, role = 'STAFF', position, name, image, bio } = await request.json();
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400, headers });
    }

    const normalizedPosition = typeof position === 'string' ? position.trim() : '';
    if (!normalizedPosition) {
      return NextResponse.json({ error: 'Position is required' }, { status: 400, headers });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409, headers });
    }

    const normalizedRole: 'ADMIN' | 'STAFF' = role === 'ADMIN' ? 'ADMIN' : 'STAFF';
    const assignedRole: 'ADMIN' | 'STAFF' = isBootstrapMode ? 'ADMIN' : normalizedRole;

    const finalPasswordHash = await hashPassword(password);
    // Keep the account effectively locked until the invitation link is verified.
    const temporaryLockedPasswordHash = await hashPassword(randomBytes(32).toString('hex'));

    const user = await prisma.user.create({
      // Cast to any to avoid type mismatch until prisma generate runs
      data: ({
        email,
        password: temporaryLockedPasswordHash,
        role: assignedRole,
        position: normalizedPosition,
        name,
        image,
        bio,
      } as any)
    });

    const invitationToken = createInvitationToken({
      sub: String(user.id),
      email,
      passwordHash: finalPasswordHash,
      exp: Math.floor(Date.now() / 1000) + INVITATION_TTL_SECONDS,
    });

    const invitationUrl = `${getAppBaseUrl(request)}/api/auth/admin/create-user?token=${encodeURIComponent(invitationToken)}`;

    try {
      await sendInvitationEmail({
        email,
        name: typeof name === 'string' ? name : null,
        role: assignedRole,
        position: normalizedPosition,
        inviteUrl: invitationUrl,
      });
    } catch (emailError) {
      await prisma.user.delete({ where: { id: user.id } }).catch(() => undefined);
      console.error('Invitation email failed:', emailError);
      return NextResponse.json({ error: 'User could not be invited. Please check email service configuration.' }, { status: 500, headers });
    }

    return NextResponse.json({
      message: 'User created in invited state. Verification email sent.',
      user: {
        id: user.id,
        email: user.email,
        role: (user as any).role,
        position: (user as any).position,
        invitationPending: true,
      }
    }, { status: 201, headers });
  } catch (error) {
    console.error('Admin create user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers });
  }
}
