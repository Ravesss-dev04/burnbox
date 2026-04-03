// app/api/auth/session/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { cookies } from 'next/headers'
import { corsHeaders } from '@/lib/corsHeaders';





export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}


export async function GET() {
  try {
    const cookieStore = cookies()
    const sessionToken = (await cookieStore).get('session_token')?.value

    if (!sessionToken) {
      return NextResponse.json({ user: null }, { headers: corsHeaders})
    }

    // Validate session
    const session = await (prisma as any).session.findUnique({
      where: { session_token: sessionToken },
      include: {
        user: {
          select: {
            id: true,
            email: true
          }
        }
      }
    })

    if (!session || session.expires_at < new Date()) {
      // Clear invalid session
      (await
            // Clear invalid session
            cookieStore).delete('session_token')
      if (session) {
        await (prisma as any).session.delete({ where: { id: session.id } })
      }
      return NextResponse.json({ user: null },{ headers: corsHeaders})
    }

    return NextResponse.json({
      user: session.user
    },
    { headers: corsHeaders}
  )

  } catch (error) {
    console.error('Session error:', error)
    return NextResponse.json({ user: null }, {status: 500, headers: corsHeaders})
    
  }
}