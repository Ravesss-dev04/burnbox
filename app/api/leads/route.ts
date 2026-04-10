// app/api/leads/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { corsHeaders } from '@/lib/corsHeaders';

const leadSchema = z.object({
  fullName: z.string().min(2),
  contactNumber: z.string().min(10),
  email: z.string().email(),
  companyName: z.string().min(2),
  inquiry: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = leadSchema.parse(body);

    // Save to database
    const lead = await prisma.lead.create({
      data: {
        fullName: validatedData.fullName,
        contactNumber: validatedData.contactNumber,
        email: validatedData.email,
        companyName: validatedData.companyName,
        inquiry: validatedData.inquiry,
      },
    });

    // Optional: Send email notification to sales team
    await sendSalesNotification(lead);

    return NextResponse.json({ 
      success: true, 
      message: 'Quotation request submitted successfully',
      data: lead 
    }, { status: 201, headers: corsHeaders });

  } catch (error) {
    console.error('Error creating lead:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation error', 
        details: error.issues 
      }, { status: 400, headers: corsHeaders });
    }

    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500, headers: corsHeaders   });
  }
}

// GET endpoint for sales team to view leads
export async function GET(request: NextRequest) {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(leads, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500, headers: corsHeaders });
  }
}

// Notification function (optional)
async function sendSalesNotification(lead: any) {
  // You can integrate with email service, Slack, etc.
  console.log('New lead received:', lead);
  
  // Example: Send email using Resend or Nodemailer
  // await sendEmail({
  //   to: 'sales@yourcompany.com',
  //   subject: 'New Quotation Request',
  //   body: `New request from ${lead.companyName}`,
  // });
}