import { NextResponse } from "next/server";
import FormData from "form-data";
import axios from "axios";
import { corsHeaders } from "@/lib/corsHeaders";

const SIGHTENGINE_URL = "https://api.sightengine.com/1.0/check.json";


export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}


export async function POST(req: Request) {
  try {
    const { imageBase64 } = await req.json();

    const user = process.env.SIGHTENGINE_USER;
    const secret = process.env.SIGHTENGINE_SECRET;

    if (!user || !secret) {
      return NextResponse.json(
        { error: "Sightengine credentials missing" },
        { status: 500,  headers: corsHeaders  }
      );
    }

    if (!imageBase64) {
      return NextResponse.json(
        { error: "Missing imageBase64 data" },
        { status: 400,  headers: corsHeaders  }
      );
    }

    // Convert base64 → buffer
    const buffer = Buffer.from(imageBase64.split(",")[1], "base64");

    // Build form data
    const form = new FormData();
    form.append("media", buffer, { filename: "upload.jpg" });
    form.append("models", "nudity,offensive,weapon,violence,quality");
    form.append("api_user", user);
    form.append("api_secret", secret);

    //  Use axios instead of fetch
    const { data } = await axios.post(SIGHTENGINE_URL, form, {
      headers: form.getHeaders(),
    });

    console.log(" Sightengine full response:", data);

    if (data.error) {
      console.error("Sightengine Error:", data.error);
      return NextResponse.json({ error: data.error.message }, { status: 400,  headers: corsHeaders  });
    }

    const nudityScore = data?.nudity?.raw || 0;
    const offensiveScore = data?.offensive?.prob || 0;
    const weaponScore = data?.weapon?.prob || 0;
    const violenceScore = data?.violence?.prob || 0;
    const blurScore = data?.quality?.blur || 0; // higher = blurrier
    const sharpnessScore = data?.quality?.sharpness || 0; // higher = clearer
     if (
      nudityScore > 0.4 ||
      offensiveScore > 0.4 ||
      weaponScore > 0.4 ||
      blurScore > 0.5 // 👈 adjust this threshold
    ) {
      let reason = "⚠️ Unsafe or inappropriate image detected.";
      if (blurScore > 0.5) reason = "🚫 Image is too blurry. Please upload a clearer photo.";
      return NextResponse.json({ blocked: true, reason }, { status: 403,  headers: corsHeaders  });
    }



    return NextResponse.json({ blocked: false, result: data },{ headers: corsHeaders});
  } catch (err: any) {
    console.error("Moderation failed:", err?.response?.data || err);
    return NextResponse.json(
      { error: "Failed to moderate image" },
      { status: 500,  headers: corsHeaders  }
    );
  }
}
