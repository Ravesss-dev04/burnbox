import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { corsHeaders } from "@/lib/corsHeaders";

const prisma = new PrismaClient();



export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

// GET all inquiries
export async function GET(req: NextRequest) {
  try {
    const inquiries = await (prisma as any).inquiry.findMany({
      orderBy: { createdAt: 'desc' }
    });
    
    return NextResponse.json(inquiries, { headers: corsHeaders });
  } catch (error: any) {
    console.error("Error fetching inquiries:", error);
    return NextResponse.json(
      { error: "Failed to fetch inquiries" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// POST new inquiry (optional - for manual creation)
export async function POST(req: NextRequest) {
  try {
    const { name, email, product, price, message, imageUrl } = await req.json();
    
    const inquiry = await (prisma as any).inquiry.create({
      data: {
        name,
        email,
        product,
        price,
        message,
        imageUrl,
        status: "New"
      }
    });
    
    return NextResponse.json({ 
      success: true, 
      inquiry 
    });
  } catch (error: any) {
    console.error("Error creating inquiry:", error);
    return NextResponse.json(
      { error: "Failed to create inquiry" },
      { status: 500, headers: corsHeaders }
    );
  }
}