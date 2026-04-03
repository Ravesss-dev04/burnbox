// app/api/auth/logout/route.ts
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { cookies } from 'next/headers'
import { corsHeaders } from '@/lib/corsHeaders';


export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST() {
  try {
    const cookieStore = cookies()
    const sessionToken = (await cookieStore).get('session_token')?.value

    if (sessionToken) {
      // Delete session from database using a raw SQL query because the generated Prisma client
      // does not expose a `session` property for this project/schema.
      await prisma.$executeRaw`DELETE FROM "Session" WHERE session_token = ${sessionToken}`;
    }

    // Clear cookie
    (await
          // Clear cookie
          cookieStore).delete('session_token')

    return NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    },
    {headers: corsHeaders}
  )

  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    )
  }
}