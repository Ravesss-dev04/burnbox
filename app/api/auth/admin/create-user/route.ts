import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hashPassword, verifyToken } from '@/lib/auth-utils';
import { getCorsHeaders } from '@/lib/corsHeaders';

const prisma = new PrismaClient();

export async function OPTIONS(request: NextRequest) {
  return NextResponse.json({}, { headers: getCorsHeaders(request.headers.get('origin')) });
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

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409, headers });
    }

    const hashedPassword = await hashPassword(password);
    const assignedRole = isBootstrapMode ? 'ADMIN' : role;
    
    const user = await prisma.user.create({
      // Cast to any to avoid type mismatch until prisma generate runs
      data: ({ email, password: hashedPassword, role: assignedRole, position, name, image, bio } as any)
    });

    return NextResponse.json({
      message: 'User created',
      user: { id: user.id, email: user.email, role: (user as any).role, position: (user as any).position }
    }, { status: 201, headers });
  } catch (error) {
    console.error('Admin create user error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers });
  }
}
