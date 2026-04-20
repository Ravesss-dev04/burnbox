// app/api/auth/reset-password/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hashPassword } from '@/lib/auth-utils'
import { corsHeaders } from '@/lib/corsHeaders';
import crypto from 'crypto';

const TOKEN_SECRET = process.env.JWT_SECRET || 'change_this_secret';

interface ResetTokenPayload {
  sub: string;
  email: string;
  marker: string;
  exp: number;
}


export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}


export async function POST(req: Request) {
  try {
    const { token, newPassword } = await req.json()

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: 'Token and new password are required' },
        { status: 400,  headers: corsHeaders }
      )
    }

    if (typeof newPassword !== 'string' || newPassword.length < 6) {
      return NextResponse.json(
        { error: 'New password must be at least 6 characters' },
        { status: 400, headers: corsHeaders }
      )
    }

    const payload = verifyResetToken(token)
    if (!payload) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400, headers: corsHeaders }
      )
    }

    const userId = Number(payload.sub)
    if (!Number.isFinite(userId)) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400, headers: corsHeaders }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        password: true,
      }
    })

    if (!user || !user.email || !user.password || user.email.toLowerCase() !== payload.email.toLowerCase()) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400, headers: corsHeaders }
      )
    }

    const currentMarker = crypto.createHmac('sha256', TOKEN_SECRET).update(user.password).digest('base64url')
    const payloadMarkerBuffer = Buffer.from(payload.marker)
    const currentMarkerBuffer = Buffer.from(currentMarker)
    if (
      payloadMarkerBuffer.length !== currentMarkerBuffer.length ||
      !crypto.timingSafeEqual(payloadMarkerBuffer, currentMarkerBuffer)
    ) {
      return NextResponse.json(
        { error: 'Invalid or expired reset token' },
        { status: 400, headers: corsHeaders }
      )
    }

    const hashedPassword = await hashPassword(newPassword)
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword
      }
    })
    
    return NextResponse.json({
      success: true,
      message: 'You have successfully changed your password.'
    },
    { headers: corsHeaders}
  )

  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    )
  }
}

function verifyResetToken(token: string): ResetTokenPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null

    const [header, encodedPayload, signature] = parts
    const unsigned = `${header}.${encodedPayload}`
    const expectedSignature = crypto.createHmac('sha256', TOKEN_SECRET).update(unsigned).digest('base64url')

    const signatureBuffer = Buffer.from(signature)
    const expectedBuffer = Buffer.from(expectedSignature)
    if (
      signatureBuffer.length !== expectedBuffer.length ||
      !crypto.timingSafeEqual(signatureBuffer, expectedBuffer)
    ) {
      return null
    }

    const payload = JSON.parse(Buffer.from(encodedPayload, 'base64url').toString('utf8')) as ResetTokenPayload
    if (!payload?.sub || !payload?.email || !payload?.marker || !payload?.exp) {
      return null
    }

    if (Date.now() > payload.exp * 1000) {
      return null
    }

    return payload
  } catch {
    return null
  }
}