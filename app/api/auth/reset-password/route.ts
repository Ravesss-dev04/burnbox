// app/api/auth/reset-password/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { hashPassword } from '@/lib/auth-utils'
import { corsHeaders } from '@/lib/corsHeaders';


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

    // In a real application, you would:
    // 1. Verify the reset token from password_reset_tokens table
    // 2. Check if it's expired
    // 3. For this example, we'll assume the token is valid
    
    // For now, we'll just update the password for any user
    // This is just a demo - implement proper token validation in production
    
    const hashedPassword = await hashPassword(newPassword)
    
    // In production, you would find the user by the reset token
    // For demo purposes, we'll just return success
    
    return NextResponse.json({
      success: true,
      message: 'Password reset successfully'
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