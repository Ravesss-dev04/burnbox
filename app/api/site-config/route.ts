import { NextResponse } from "next/server";
import { prisma as db } from "@/lib/db";
import { corsHeaders } from "@/lib/corsHeaders";


export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}


export async function GET() {
  try {
    const configs = await db.siteConfig.findMany();
    // Convert array of configs to a single object
    const configMap = configs.reduce((acc: Record<string, any>, config: any) => {
      acc[config.key] = config.value;
      return acc;
    }, {} as Record<string, any>);

    return NextResponse.json(configMap, { headers: corsHeaders });
  } catch (error) {
    console.error("Error fetching site config:", error);
    return NextResponse.json(
      { error: "Failed to fetch site configuration" },
      { status: 500, headers: corsHeaders }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const updates = [];

    // Iterate over keys and update/create them
    for (const [key, value] of Object.entries(body)) {
      updates.push(
        db.siteConfig.upsert({
          where: { key },
          update: { value: value as any },
          create: { key, value: value as any },
        })
      );
    }

    await db.$transaction(updates);

    return NextResponse.json({ success: true }, { headers: corsHeaders });
  } catch (error) {
    console.error("Error saving site config:", error);
    return NextResponse.json(
      { error: "Failed to save site configuration" },
      { status: 500, headers: corsHeaders }
    );
  }
}
