// app/api/leads/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { corsHeaders } from '@/lib/corsHeaders';

const updateLeadSchema = z.object({
  status: z.enum(['PENDING', 'PROCESSING', 'COMPLETED', 'REJECTED']).optional(),
  quotationSent: z.boolean().optional(),
  fullName: z.string().min(2).optional(),
  contactNumber: z.string().min(10).optional(),
  email: z.string().email().optional(),
  companyName: z.string().min(2).optional(),
  inquiry: z.string().optional(),
});

// GET - Fetch a single lead by ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // ✅ Await params - Next.js 15 requires this
    const { id } = await params;
    
    const lead = await prisma.lead.findUnique({
      where: { id },
    });

    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(lead, { headers: corsHeaders });
  } catch (error) {
    console.error('Error fetching lead:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lead' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// PATCH - Update a lead by ID
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // ✅ Await params - Next.js 15 requires this
    const { id } = await params;
    const body = await request.json();

    const validatedData = updateLeadSchema.parse(body);

    // Check if lead exists
    const existingLead = await prisma.lead.findUnique({
      where: { id },
    });

    if (!existingLead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    // Update the lead
    const updatedLead = await prisma.lead.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json({
      success: true,
      message: 'Lead updated successfully',
      data: updatedLead,
    }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error updating lead:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: 'Validation error',
          details: error.issues,
        },
        { status: 400, headers: corsHeaders }
      );
    }

    return NextResponse.json(
      { error: 'Failed to update lead' },
      { status: 500, headers: corsHeaders }
    );
  }
}

// DELETE - Delete a lead by ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    // ✅ Await params - Next.js 15 requires this
    const { id } = await params;

    const existingLead = await prisma.lead.findUnique({
      where: { id },
    });

    if (!existingLead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404, headers: corsHeaders }
      );
    }

    await prisma.lead.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Lead deleted successfully',
    }, { headers: corsHeaders });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return NextResponse.json(
      { error: 'Failed to delete lead' },
      { status: 500, headers: corsHeaders }
    );
  }
}


