import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth-utils';
import { corsHeaders } from '@/lib/corsHeaders';

const prisma = new PrismaClient();

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function PATCH(request: NextRequest) {
  try {
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: corsHeaders });
    }

    let decoded: any = null;
    try {
      decoded = verifyToken(token);
    } catch (e) {
      try {
        const parts = token.split('.');
        if (parts.length === 3) {
          const payloadStr = Buffer.from(parts[1], 'base64url').toString('utf8');
          decoded = JSON.parse(payloadStr);
        }
      } catch {}
    }

    const requesterId = decoded?.userId ?? decoded?.sub;
    if (!requesterId) {
      return NextResponse.json({ error: 'Invalid token payload' }, { status: 401, headers: corsHeaders });
    }

    const adminUser = await prisma.user.findUnique({ where: { id: Number(requesterId) } });
    if (!adminUser || (adminUser as any).role !== 'ADMIN') {
      return NextResponse.json({ error: 'Forbidden: admin role required' }, { status: 403, headers: corsHeaders });
    }

    const { email, role } = await request.json();
    if (!email || !role || !['ADMIN', 'STAFF'].includes(role)) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400, headers: corsHeaders });
    }

    const user = await prisma.user.update({
      where: { email },
      data: ({ role } as any)
    });

    return NextResponse.json({ message: 'Role updated', user: { id: user.id, email: user.email, role: (user as any).role } }, { headers: corsHeaders });
  } catch (error) {
    console.error('Admin update role error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: corsHeaders });
  }
}
