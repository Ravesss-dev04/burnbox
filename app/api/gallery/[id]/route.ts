import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { corsHeaders } from "@/lib/corsHeaders";

const prisma = new PrismaClient();

// DELETE gallery image

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}


export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> } // params is a Promise
) {
  try {
    // Await the params first
    const { id } = await params;
    await (prisma as any).gallery.delete({
      where: { id: parseInt(id) } // Use the awaited id
    });
    return NextResponse.json({ success: true }, {headers: corsHeaders });
  } catch (error) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500, headers: corsHeaders  }
    );
  } finally {
    await prisma.$disconnect();
  }
}




// Also update the GET function if you have one
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const imageId = parseInt(id);
    if (isNaN(imageId)) {
      return NextResponse.json(
        { error: "Invalid image ID" },
        { status: 400, headers: corsHeaders  }
      );
    }
    
    const image = await (prisma as any).gallery.findUnique({
      where: { id: imageId }
    });
    if (!image) {
      return NextResponse.json(
        { error: "Image not found" },
        { status: 404, headers: corsHeaders  }
      );
    }

    return NextResponse.json(image, {headers: corsHeaders });
  } catch (error) {
    console.error("Get image error:", error);
    return NextResponse.json(
      { error: "Failed to fetch image" },
      { status: 500, headers: corsHeaders  }
    );
  } finally {
    await prisma.$disconnect();
  }
}



