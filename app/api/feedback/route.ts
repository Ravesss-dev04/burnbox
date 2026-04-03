import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import nodemailer from "nodemailer";
import { corsHeaders } from "@/lib/corsHeaders";
import { prisma } from "@/lib/db";


export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: Request) {
  try {
    const { name, email, message, rating } = await req.json();
    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required." }, 
        { status: 400, headers: corsHeaders }
      );
    }    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format." }, 
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate rating if provided (1-5)
    if (rating && (rating < 1 || rating > 5)) {
      return NextResponse.json(
        { error: "Rating must be between 1 and 5." }, 
        { status: 400, headers: corsHeaders }
      );
    }

    // Validate message length
    if (message.length > 2000) {
      return NextResponse.json(
        { error: "Message is too long. Maximum 2000 characters." }, 
        { status: 400, headers: corsHeaders }
      );
    }

    // Save feedback to database
    const feedback = await prisma.feedback.create({
      data: {
        name,
        email,
        message,
        rating: rating ? Number(rating) : null,
      }
    });

    // Send notification email to business
    await sendFeedbackNotification({ name, email, message, rating });

    return NextResponse.json({ 
      success: true, 
      message: "Thank you for your feedback!",
      feedback 
    }, { headers: corsHeaders });

  } catch (error: any) {
    console.error("Error in feedback submission:", error);
    return NextResponse.json(
      { error: "Failed to submit feedback" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Get all feedback (for admin dashboard)
export async function GET(req: Request) {
  try {
    const feedbacks = await prisma.feedback.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json({ 
      success: true, 
      feedbacks 
    }, { headers: corsHeaders });

  } catch (error: any) {
    console.error("Error fetching feedback:", error);
    return NextResponse.json(
      { error: "Failed to fetch feedback" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Delete feedback
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: "Feedback ID is required" },
        { status: 400, headers: corsHeaders }
      );
    }

    await prisma.feedback.delete({
      where: {
        id: Number(id)
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: "Feedback deleted successfully" 
    }, { headers: corsHeaders });

  } catch (error: any) {
    console.error("Error deleting feedback:", error);
    return NextResponse.json(
      { error: "Failed to delete feedback" },
      { status: 500, headers: corsHeaders }
    );
  }
}

// Send feedback notification to business
async function sendFeedbackNotification({ 
  name, 
  email, 
  message, 
  rating 
}: {
  name: string;
  email: string;
  message: string;
  rating?: number | null;
}) {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    const ratingStars = rating ? '⭐'.repeat(rating) + '☆'.repeat(5 - rating) : 'Not provided';
    const htmlBody = `
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
              }
              .header { 
                  background: linear-gradient(135deg, #F43C6D, #ff6b6b); 
                  padding: 20px; 
                  border-radius: 8px; 
                  margin-bottom: 20px;
                  text-align: center;
                  color: white;
              }
              .field { 
                  margin-bottom: 15px; 
                  padding: 10px;
                  border-left: 4px solid #F43C6D;
                  background: #f8f9fa;
              }
              .label { 
                  font-weight: bold; 
                  color: #555; 
                  display: block;
                  margin-bottom: 5px;
              }
              .message { 
                  background: #f8f9fa; 
                  padding: 15px; 
                  border-radius: 5px; 
                  margin: 15px 0;
                  border-left: 4px solid #28a745;
              }
              .rating {
                  font-size: 24px;
                  margin: 10px 0;
              }
          </style>
      </head>
      <body>
          <div class="header">
              <h1 style="margin: 0; color: white;">New Customer Feedback</h1>
          </div>
          
          <div class="field">
              <span class="label">Name:</span> 
              ${name}
          </div>
          
          <div class="field">
              <span class="label">Email:</span> 
              <a href="mailto:${email}">${email}</a>
          </div>
          
          ${rating ? `
          <div class="field">
              <span class="label">Rating:</span>
              <div class="rating">${ratingStars}</div>
              <p style="margin: 5px 0 0 0; color: #666;">${rating} out of 5 stars</p>
          </div>
          ` : ''}
          
          <div class="field">
              <span class="label">Message:</span>
              <div class="message">${message.replace(/\n/g, '<br>')}</div>
          </div>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
          <p style="text-align: center; color: #666; font-size: 12px;">
              This feedback was submitted from your website and saved to the database.
          </p>
      </body>
      </html>
    `;
    const mailOptions = {
      from: `"Burnbox Printing" <${process.env.EMAIL_USER}>`,
      to: process.env.BUSINESS_EMAIL,
      subject: `New Customer Feedback from ${name}${rating ? ` - ${rating}⭐` : ''}`,
      html: htmlBody,
    };

    await transporter.sendMail(mailOptions);
    console.log("Feedback notification email sent successfully");

  } catch (emailError) {
    console.error("Failed to send feedback notification email:", emailError);
    // Don't throw error - feedback was already saved
  }
}