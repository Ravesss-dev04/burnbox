import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { hashPassword } from '@/lib/auth-utils';
import { corsHeaders } from '@/lib/corsHeaders';

const prisma = new PrismaClient();


export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}



export async function POST(request: NextRequest) {
  try {
    // Public registration disabled. Use admin endpoint.
    return NextResponse.json(
      { error: 'Registration disabled. Ask an admin to create your account.' },
      { status: 403, headers: corsHeaders }
    );

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    );
  }
}