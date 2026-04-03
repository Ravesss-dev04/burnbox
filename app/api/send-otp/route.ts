// Alternative version with attached image
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { otpStore } from "@/lib/otp-store";
import fs from 'fs';
import path from 'path';
import { corsHeaders } from "@/lib/corsHeaders";


export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400, headers: corsHeaders  });
    }
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Store OTP with 10-minute expiration
    otpStore.set(email, otp, 10 * 60 * 1000);
    // Create email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Email content
    const mailOptions = {
      from: `"BurnBox Printing" <${process.env.BUSINESS_EMAIL}>`,
      to: email,
      subject: "Your OTP Code",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    line-height: 1.6; 
                    color: #333; 
                    max-width: 600px; 
                    margin: 0 auto; 
                    padding: 20px;
                    background-color: #f9f9f9;
                }
                .container {
                    background: white;
                    border-radius: 10px;
                    padding: 30px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                .header { 
                    text-align: center;
                    margin-bottom: 30px;
                }
                .logo {
                    width: 80px;
                    height: 80px;
                    margin-bottom: 15px;
                }
                .otp-code { 
                    font-size: 42px; 
                    font-weight: bold; 
                    text-align: center; 
                    color: #F43C6D; 
                    margin: 30px 0;
                    padding: 20px;
                    background: linear-gradient(135deg, #f8f9fa, #e9ecef);
                    border-radius: 10px;
                    letter-spacing: 8px;
                    border: 2px dashed #F43C6D;
                }
                .note { 
                    background: #fff3cd; 
                    border: 1px solid #ffeaa7; 
                    border-radius: 8px; 
                    padding: 20px; 
                    margin: 20px 0;
                    color: #856404;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <!-- Using CID reference for attached image -->
                    <img src="cid:companyLogo" alt="Company Logo" class="logo" />
                    <h1 style="margin: 0; color: #333; font-size: 28px;">Verification Code</h1>
                    <p style="margin: 10px 0 0 0; color: #666; font-size: 16px;">Use this code to verify your email</p>
                </div>
                
                <p>Hello, Thank you for your Interest to us!</p>
                <p>Please use the verification code below to complete your inquiry:</p>
                
                <div class="otp-code">${otp}</div>
                
                <div class="note">
                    <p><strong>Note:</strong></p>
                    <ul>
                        <li>This code will expire in 10 minutes</li>
                        <li>Do not share this code with anyone</li>
                    </ul>
                </div>
                
                <p>Best regards,<br>Burnbox Team</p>
            </div>
        </body>
        </html>
      `,
      attachments: [
        {
          filename: 'bblogo.png',
          path: path.join(process.cwd(), 'public', 'bblogo.png'), // Path to your logo
          cid: 'companyLogo' // same cid value as in the html img src
        }
      ]
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    console.log(`OTP sent to ${email}: ${otp}`);

    return NextResponse.json({ 
      success: true, 
      message: "OTP sent successfully to your email" 
    },
    { headers: corsHeaders}
  );

  } catch (error) {
    console.error("OTP send error:", error);
    return NextResponse.json({ 
      error: "Failed to send OTP. Please try again." 
    }, { status: 500,  headers: corsHeaders });
  }
}