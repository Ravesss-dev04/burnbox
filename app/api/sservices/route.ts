import { corsHeaders } from "@/lib/corsHeaders";
import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();


export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}



export async function GET () {
    try {
        const services  = await prisma.service.findMany({
            orderBy: {createdAt: 'desc'}
        })
        return NextResponse.json(services, { headers: corsHeaders });
    } catch (error) {
        return NextResponse.json(
            {error: "Failed to fetch services"},
            {status: 500,  headers: corsHeaders}
        );
    }
}



// POST NEW SERVICE


export async function POST(req: NextRequest) {
  try {
    const { name, price, imageUrl, description } = await req.json();
    
    const newService = await prisma.service.create({
      data: {
        name,
        price: parseFloat(price),
        imageUrl,
        description: description || ""
      }
    });
    
    return NextResponse.json(newService, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create service" },
      { status: 500, headers: corsHeaders }
    );
  }
}