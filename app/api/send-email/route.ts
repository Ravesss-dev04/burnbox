// api/send-email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import validator from 'validator';

export async function POST(request: NextRequest) {
  try {
    const { email, message, timestamp, source } = await request.json();

    // Validate input
    if (!email || !message) {
      return NextResponse.json(
        { message: 'Email and message are required' },
        { status: 400 }
      );
    }
    // Validate email format
    if (!validator.isEmail(email)) {
      return NextResponse.json(
        { message: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedEmail = validator.normalizeEmail(email);
    const sanitizedMessage = validator.escape(message).trim();

    // Check if normalized email is valid
    if (!sanitizedEmail || !validator.isEmail(sanitizedEmail)) {
      return NextResponse.json(
        { message: 'Invalid email address' },
        { status: 400 }
      );
    }

    // Check message length
    if (sanitizedMessage.length < 5) {
      return NextResponse.json(
        { message: 'Message is too short' },
        { status: 400 }
      );
    }

    // Check for potential spam keywords in message
    const spamKeywords = ['viagra', 'casino', 'lottery', 'loan', 'prize', 'winner'];
    const hasSpamKeywords = spamKeywords.some(keyword => 
      sanitizedMessage.toLowerCase().includes(keyword)
    );

    if (hasSpamKeywords) {
      console.log('Potential spam message detected');
      // You can choose to reject or still send with caution
      // For now, we'll still send but log it
    }

    // Basic rate limiting check (you might want to implement more sophisticated rate limiting)
    if (timestamp) {
      const requestTime = parseInt(timestamp);
      const currentTime = Date.now();
      const timeDiff = currentTime - requestTime;
      
      // If request is too quick (less than 2 seconds), might be a bot
      if (timeDiff < 2000) {
        console.log('Potential bot detected - request too quick');
        // You can choose to reject or add delay
      }
    }

    // Validate environment variables
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS || !process.env.BUSINESS_EMAIL) {
      console.error('Missing email configuration');
      return NextResponse.json(
        { message: 'Email service not configured properly' },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.EMAIL_PORT || '465'),
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify transporter configuration
    await transporter.verify();

    // Prepare mail options with proper typing
    const mailOptions = {
      from: `"BurnBox Printing" <${process.env.EMAIL_USER}>`,
      to: process.env.BUSINESS_EMAIL,
      replyTo: sanitizedEmail, // This is now guaranteed to be a string
      subject: `New Contact Form Submission from ${sanitizedEmail}`,
      text: `From: ${sanitizedEmail}\n\nMessage: ${sanitizedMessage}\n\nSource: ${source || 'website-contact-form'}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #FA7EA0, #ff6b6b); padding: 20px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 24px;">New Contact Form Submission</h1>
          </div>
          <div style="padding: 20px; background: #f9f9f9;">
            <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <h2 style="color: #333; margin-bottom: 16px;">Contact Details</h2>
              <p style="margin: 8px 0;"><strong>From:</strong> ${sanitizedEmail}</p>
              <p style="margin: 8px 0;"><strong>Source:</strong> ${source || 'website-contact-form'}</p>
              <p style="margin: 8px 0;"><strong>Time:</strong> ${new Date().toLocaleString()}</p>
              
              <h3 style="color: #333; margin: 20px 0 8px 0;">Message:</h3>
              <div style="background: #f5f5f5; padding: 15px; border-left: 4px solid #FA7EA0; border-radius: 4px;">
                ${sanitizedMessage.replace(/\n/g, '<br>')}
              </div>
            </div>
          </div>
          <div style="background: #333; color: white; padding: 15px; text-align: center; font-size: 12px;">
            <p style="margin: 0;">This email was sent from your website contact form at BurnBox Printing.</p>
            <p style="margin: 5px 0 0 0;">© ${new Date().getFullYear()} BurnBox Printing. All rights reserved.</p>
          </div>
        </div>
      `,
      // Add headers to help with email deliverability
      headers: {
        'X-Priority': '1',
        'X-MSMail-Priority': 'High',
        'Importance': 'high'
      }
    };

    await transporter.sendMail(mailOptions);

    console.log('Email sent successfully from:', sanitizedEmail);
    
    return NextResponse.json({ 
      message: 'Email sent successfully',
      success: true 
    });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { 
        message: 'Error sending email. Please try again later.',
        success: false
      },
      { status: 500 }
    );
  }
}

// Optional: Add other HTTP methods if needed
export async function GET() {
  return NextResponse.json(
    { message: 'Method not allowed' },
    { status: 405 }
  );
}