import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { corsHeaders } from "@/lib/corsHeaders";

const prisma = new PrismaClient();

//  GET all gallery images


export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}


export async function GET() {
  try {
    const gallery = await prisma.gallery.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(gallery, { headers: corsHeaders});
  } catch (error) {
    console.error("Fetch gallery error:", error);
    return NextResponse.json(
      { error: "Failed to fetch gallery" },
      { status: 500, headers: corsHeaders  }
    );
  } finally {
    await prisma.$disconnect();
  }
}

//  POST new gallery image
export async function POST(req: NextRequest) {
  try {
    const { imageUrl, title, altText } = await req.json();

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Image URL is required" },
        { status: 400, headers: corsHeaders  }
      );
    }

    const newImage = await prisma.gallery.create({
      data: {
        imageUrl,
        title: title || "",
        altText: altText || "",
      },
    });

    return NextResponse.json(newImage, {headers: corsHeaders });
  } catch (error) {
    console.error("Create gallery error:", error);
    return NextResponse.json(
      { error: "Failed to add image to gallery" },
      { status: 500, headers: corsHeaders  }
    );
  } finally {
    await prisma.$disconnect();
  }
}
