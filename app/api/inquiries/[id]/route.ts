import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { corsHeaders } from "@/lib/corsHeaders";

const prisma = new PrismaClient();


export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}


// GET single inquiry
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const inquiryId = parseInt(id);
    
    if (isNaN(inquiryId)) {
      return NextResponse.json(
        { error: "Invalid inquiry ID" },
        { status: 400, headers: corsHeaders }
      );
    }

    const inquiry = await (prisma as any).inquiry.findUnique({
      where: { id: inquiryId }
    });

    if (!inquiry) {
      return NextResponse.json(
        { error: "Inquiry not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    return NextResponse.json(inquiry, { headers: corsHeaders });
  } catch (error: any) {
    console.error("Error fetching inquiry:", error);
    return NextResponse.json(
      { error: "Failed to fetch inquiry" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// DELETE inquiry
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const inquiryId = parseInt(id);
    
    if (isNaN(inquiryId)) {
      return NextResponse.json(
        { error: "Invalid inquiry ID" },
        { status: 400 }
      );
    }

    // Check if inquiry exists first
    const inquiry = await (prisma as any).inquiry.findUnique({
      where: { id: inquiryId }
    });

    if (!inquiry) {
      return NextResponse.json(
        { error: "Inquiry not found" },
        { status: 404 }
      );
    }
    await (prisma as any).inquiry.delete({
      where: { id: inquiryId }
    });
    return NextResponse.json({ 
      success: true,
      message: "Inquiry deleted successfully" 
    });
  } catch (error: any) {
    console.error("Error deleting inquiry:", error);
    return NextResponse.json(
      { error: "Failed to delete inquiry" },
      { status: 500 }
    );
  }
}
// UPDATE inquiry status
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const inquiryId = parseInt(id);
    
    if (isNaN(inquiryId)) {
      return NextResponse.json(
        { error: "Invalid inquiry ID" },
        { status: 400 }
      );
    }

    const { status } = await req.json();
    
    // Validate status
    const validStatuses = ["New", "Contacted", "Completed"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { error: "Invalid status" },
        { status: 400, headers: corsHeaders }
      );
    }

    // Check if inquiry exists
    const existingInquiry = await (prisma as any).inquiry.findUnique({
      where: { id: inquiryId }
    });

    if (!existingInquiry) {
      return NextResponse.json(
        { error: "Inquiry not found" },
        { status: 404, headers: corsHeaders }
      );
    }

    // Update the inquiry
    const inquiry = await (prisma as any).inquiry.update({
      where: { id: inquiryId },
      data: { status }
    });
    
    return NextResponse.json({ 
      success: true,
      inquiry 
    }, { headers: corsHeaders });
  } catch (error: any) {
    console.error("Error updating inquiry:", error);
    return NextResponse.json(
      { error: "Failed to update inquiry" },
      { status: 500, headers: corsHeaders }
    );
  }
}