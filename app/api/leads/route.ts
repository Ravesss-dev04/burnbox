// app/api/leads/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { z } from 'zod';
import { corsHeaders } from '@/lib/corsHeaders';
import nodemailer from 'nodemailer';

const QUOTATION_NOTIFICATION_TYPE = 'QUOTATION_SUBMITTED';

interface LeadRecipient {
  id: number;
  email: string | null;
  name: string | null;
  role: string;
  position: string | null;
}

interface LeadPayload {
  id: string;
  fullName: string | null;
  contactNumber: string;
  email: string;
  companyName: string;
  inquiry: string | null;
  createdAt: Date;
}

const leadSchema = z.object({
  fullName: z.string().min(2),
  contactNumber: z.string().min(10),
  email: z.string().email(),
  companyName: z.string().min(2),
  inquiry: z.string().optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = leadSchema.parse(body);

    // Save to database
    const lead = await prisma.lead.create({
      data: {
        fullName: validatedData.fullName,
        contactNumber: validatedData.contactNumber,
        email: validatedData.email,
        companyName: validatedData.companyName,
        inquiry: validatedData.inquiry,
      },
    });

    // Dispatch alerts asynchronously so the client request is not blocked.
    void dispatchLeadAlerts(lead, request).catch((dispatchError) => {
      console.error('Lead alert dispatch error:', dispatchError);
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Quotation request submitted successfully',
      data: lead 
    }, { status: 201, headers: corsHeaders });

  } catch (error) {
    console.error('Error creating lead:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json({ 
        error: 'Validation error', 
        details: error.issues 
      }, { status: 400, headers: corsHeaders });
    }

    return NextResponse.json({ 
      error: 'Internal server error' 
    }, { status: 500, headers: corsHeaders   });
  }
}

// GET endpoint for sales team to view leads
export async function GET(request: NextRequest) {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(leads, { headers: corsHeaders });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch leads' }, { status: 500, headers: corsHeaders });
  }
}

async function dispatchLeadAlerts(lead: LeadPayload, request: NextRequest) {
  await ensureNotificationTable();

  const recipients = await getQuotationRecipients();
  if (recipients.length === 0) {
    return;
  }

  const clientName = lead.fullName?.trim() || lead.companyName;
  const notificationMessage = `New quotation submitted by ${clientName}`;

  await Promise.allSettled(
    recipients.map((recipient) =>
      prisma.$executeRaw`
        INSERT INTO notifications (user_id, type, message, related_id, is_read, created_at)
        VALUES (${recipient.id}, ${QUOTATION_NOTIFICATION_TYPE}, ${notificationMessage}, ${lead.id}, ${false}, NOW(3))
      `
    )
  );

  await sendRecipientEmails(lead, recipients, request);
}

async function getQuotationRecipients(): Promise<LeadRecipient[]> {
  const recipients = await prisma.$queryRaw<LeadRecipient[]>`
    SELECT id, email, name, role, position
    FROM \`user\`
    WHERE email IS NOT NULL
      AND password IS NOT NULL
      AND (
        role = 'ADMIN'
        OR LOWER(COALESCE(position, '')) = 'sales'
      )
  `;

  return recipients;
}

function getAppBaseUrl(request: NextRequest): string {
  const forwardedHost = request.headers.get('x-forwarded-host');
  const forwardedProto = request.headers.get('x-forwarded-proto');
  if (forwardedHost) {
    return `${forwardedProto || 'https'}://${forwardedHost}`.replace(/\/$/, '');
  }

  const requestOrigin = request.nextUrl?.origin;
  if (requestOrigin) {
    return requestOrigin.replace(/\/$/, '');
  }

  const host = request.headers.get('host');
  if (host) {
    const isLocal = host.includes('localhost') || host.startsWith('127.0.0.1');
    const protocol = isLocal ? 'http' : 'https';
    return `${protocol}://${host}`.replace(/\/$/, '');
  }

  return (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000').replace(/\/$/, '');
}

function buildQuotationEmailHtml(lead: LeadPayload, dashboardUrl: string, recipientName: string) {
  const summaryText = lead.inquiry?.trim() || 'No additional details provided by the client.';
  const clientName = lead.fullName?.trim() || lead.companyName;

  return `
    <div style="font-family: Arial, sans-serif; color: #111; max-width: 640px; margin: 0 auto;">
      <h2 style="margin-bottom: 6px;">New Quotation Submission Received</h2>
      <p style="margin-top: 0; color: #444;">Hello ${recipientName}, a new quotation request has been submitted.</p>

      <div style="border: 1px solid #e5e7eb; border-radius: 10px; padding: 16px; margin: 16px 0; background: #fafafa;">
        <p style="margin: 0 0 8px;"><strong>Client name:</strong> ${clientName}</p>
        <p style="margin: 0 0 8px;"><strong>Client email:</strong> ${lead.email}</p>
        <p style="margin: 0 0 8px;"><strong>Contact number:</strong> ${lead.contactNumber}</p>
        <p style="margin: 0 0 8px;"><strong>Company:</strong> ${lead.companyName}</p>
        <p style="margin: 0 0 8px;"><strong>Request summary:</strong> ${summaryText}</p>
      </div>

      <a href="${dashboardUrl}" style="display: inline-block; background: #f43c6d; color: white; text-decoration: none; padding: 12px 18px; border-radius: 8px; font-weight: 600;">
        Open Sales Leads in Admin Dashboard
      </a>

      <p style="margin-top: 16px; color: #666; font-size: 13px;">
        After opening the dashboard, go to the Leads section to view full details.
      </p>
    </div>
  `;
}

async function sendRecipientEmails(lead: LeadPayload, recipients: LeadRecipient[], request: NextRequest) {
  const smtpHost = process.env.EMAIL_HOST;
  const smtpPort = Number(process.env.EMAIL_PORT || '0');
  const smtpUser = process.env.EMAIL_USER;
  const smtpPass = process.env.EMAIL_PASS;
  const fromAddress = process.env.BUSINESS_EMAIL || smtpUser;

  if (!smtpHost || !smtpPort || !smtpUser || !smtpPass || !fromAddress) {
    console.warn('Quotation notification emails skipped: SMTP configuration is incomplete.');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpPort === 465,
    auth: {
      user: smtpUser,
      pass: smtpPass,
    },
  });

  const dashboardUrl = `${getAppBaseUrl(request)}/admin`;

  const emailTasks = recipients
    .filter((recipient) => Boolean(recipient.email))
    .map((recipient) => {
      const recipientName = recipient.name?.trim() || recipient.email || 'Team Member';
      return transporter.sendMail({
        from: `"Burnbox Team" <${fromAddress}>`,
        to: recipient.email as string,
        subject: 'New Quotation Submission Received',
        html: buildQuotationEmailHtml(lead, dashboardUrl, recipientName),
      });
    });

  const results = await Promise.allSettled(emailTasks);
  const failedCount = results.filter((result) => result.status === 'rejected').length;
  if (failedCount > 0) {
    console.error(`Quotation notification email failures: ${failedCount}`);
  }
}

async function ensureNotificationTable() {
  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INT NOT NULL AUTO_INCREMENT,
      user_id INT NOT NULL,
      type VARCHAR(64) NOT NULL,
      message TEXT NOT NULL,
      related_id VARCHAR(191) NULL,
      is_read BOOLEAN NOT NULL DEFAULT false,
      created_at DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
      PRIMARY KEY (id),
      INDEX idx_notifications_user_created (user_id, created_at),
      INDEX idx_notifications_user_read (user_id, is_read)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
  `);
}