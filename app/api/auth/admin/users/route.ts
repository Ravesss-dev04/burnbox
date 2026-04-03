import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@/lib/auth-utils';
import { corsHeaders } from '@/lib/corsHeaders';

const prisma = new PrismaClient();

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// Helper to verify admin access
async function verifyAdmin(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  if (!token) return null;

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

  if (!decoded) return null;

  const requesterId = decoded.userId ?? decoded.sub;
  if (!requesterId) return null;

  const adminUser = await prisma.user.findUnique({ where: { id: Number(requesterId) } });
  if (!adminUser || (adminUser as any).role !== 'ADMIN') return null;

  return adminUser;
}

export async function GET(request: NextRequest) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403, headers: corsHeaders });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        role: true,
        position: true,
        created_at: true
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    return NextResponse.json({ users }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: corsHeaders });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const admin = await verifyAdmin(request);
    if (!admin) {
      return NextResponse.json({ error: 'Unauthorized: Admin access required' }, { status: 403, headers: corsHeaders });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400, headers: corsHeaders });
    }

    const userId = Number(id);
    
    // Prevent deleting yourself
    if (userId === admin.id) {
      return NextResponse.json({ error: 'You cannot delete your own account' }, { status: 400, headers: corsHeaders });
    }

    await prisma.user.delete({
      where: { id: userId }
    });

    return NextResponse.json({ message: 'User deleted successfully' }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500, headers: corsHeaders });
  }
}
