// app/api/verify-otp/route.ts
import { NextResponse } from "next/server";
import { otpStore } from "@/lib/otp-store";
import { corsHeaders } from "@/lib/corsHeaders";


export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}


export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ 
        success: false, 
        message: "Email and OTP are required" 
      }, { status: 400,  headers: corsHeaders });
    }

    if (otpStore.isValid(email, otp)) {
      otpStore.delete(email);
      return NextResponse.json({ 
        success: true, 
        message: "OTP verified successfully" 
      },
      {headers: corsHeaders }
    );
    } else {
      return NextResponse.json({ 
        success: false, 
        message: "Invalid or expired OTP" 
      }, { status: 400,  headers: corsHeaders });
    }

  } catch (error) {
    console.error("OTP verify error:", error);
    return NextResponse.json({ 
      success: false, 
      message: "Verification failed" 
    }, { status: 500, headers: corsHeaders });
  }
}