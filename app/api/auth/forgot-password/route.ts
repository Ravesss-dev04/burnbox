import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { corsHeaders } from '@/lib/corsHeaders';

const prisma = new PrismaClient();


export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}


export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400, headers: corsHeaders }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      // Don't reveal whether user exists
      return NextResponse.json({
        message: 'If an account with that email exists, a reset link has been sent'
      },
      {headers: corsHeaders}
    );
    }
    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour

    await prisma.user.update({
      where: { email },
      data: {
        resetToken,
        resetTokenExpiry
      } as any
    });
    // TODO: Send email with reset link
    console.log('Reset token:', resetToken); // For development

    return NextResponse.json({
      message: 'If an account with that email exists, a reset link has been sent'
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




