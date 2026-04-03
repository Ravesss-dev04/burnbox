import { corsHeaders } from "@/lib/corsHeaders";
import { NextRequest, NextResponse } from "next/server";

const GITHUB_TOKEN = process.env.GITHUB_TOKEN!;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME!;
const GITHUB_REPO = process.env.GITHUB_REPO!;



export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}


export async function POST(req: NextRequest) {
  try {
    const { images } = await req.json(); // [{ name, content (base64) }]
    const uploadedUrls: string[] = [];

    for (const img of images) {
      const filePath = `uploads/${Date.now()}-${img.name}`;
      const githubApiUrl = `https://api.github.com/repos/${GITHUB_USERNAME}/${GITHUB_REPO}/contents/${filePath}`;

      const response = await fetch(githubApiUrl, {
        method: "PUT",
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: `Upload ${img.name}`,
          content: img.content,
          branch: "main",
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        console.error("GitHub upload failed:", data);
        throw new Error(`Failed to upload ${img.name}`);
      }

      // FIX: Correct the raw.githubusercontent.com URL (not row.githubusercontent.com)
      const imageUrl = `https://raw.githubusercontent.com/${GITHUB_USERNAME}/${GITHUB_REPO}/main/${filePath}`;
      uploadedUrls.push(imageUrl);
      
      console.log('Uploaded image URL:', imageUrl); // Debug log
    }
    return NextResponse.json({ success: true, urls: uploadedUrls },{ headers: corsHeaders});
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500, headers: corsHeaders });
  }
}