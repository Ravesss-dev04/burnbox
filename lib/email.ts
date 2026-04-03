// lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface LeadData {
  id: string;
  contactNumber: string;
  email: string;
  companyName: string;
  inquiry: string | null;
  createdAt: Date;
}

// Send notification to sales team
export async function sendSalesNotificationEmail(lead: LeadData) {
  const dashboardUrl = `${process.env.NEXT_PUBLIC_APP_URL}/admin/saleslead`;
  
  await resend.emails.send({
    from: 'Quotation System <noreply@yourcompany.com>',
    to: [process.env.SALES_EMAIL!],
    subject: `🔔 New Quotation Request from ${lead.companyName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .field { margin-bottom: 20px; }
          .label { font-weight: bold; color: #4b5563; margin-bottom: 5px; display: block; }
          .value { background: white; padding: 10px; border-radius: 5px; border: 1px solid #e5e7eb; }
          .badge { display: inline-block; background: #10b981; color: white; padding: 5px 10px; border-radius: 5px; font-size: 12px; margin-bottom: 20px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #9ca3af; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📋 New Quotation Request</h1>
            <p>Action Required</p>
          </div>
          <div class="content">
            <div class="badge">New Lead</div>
            
            <div class="field">
              <span class="label">Company Name:</span>
              <div class="value">${lead.companyName}</div>
            </div>
            
            <div class="field">
              <span class="label">Contact Number:</span>
              <div class="value">${lead.contactNumber}</div>
            </div>
            
            <div class="field">
              <span class="label">Email Address:</span>
              <div class="value">${lead.email}</div>
            </div>
            
            <div class="field">
              <span class="label">Inquiry Details:</span>
              <div class="value">${lead.inquiry || 'No additional details provided'}</div>
            </div>
            
            <div class="field">
              <span class="label">Requested At:</span>
              <div class="value">${new Date(lead.createdAt).toLocaleString()}</div>
            </div>
            
            <a href="${dashboardUrl}" class="button">View in Dashboard →</a>
            <a href="mailto:${lead.email}?subject=Quotation for ${lead.companyName}" style="display: inline-block; background: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 20px; margin-left: 10px;">
              Reply to Customer →
            </a>
          </div>
          <div class="footer">
            <p>This is an automated notification from your Quotation System.</p>
            <p>To update lead status, please visit the sales dashboard.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}

// Send confirmation email to customer
export async function sendCustomerConfirmationEmail(lead: LeadData) {
  await resend.emails.send({
    from: 'Your Company <hello@yourcompany.com>',
    to: [lead.email],
    subject: `We've received your quotation request!`,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin-top: 20px; }
          .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #9ca3af; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Thank you for your request! 🎉</h1>
          </div>
          <div class="content">
            <p>Dear ${lead.companyName},</p>
            
            <p>Thank you for requesting a quotation. We've received your inquiry and our sales team will get back to you within 24 hours.</p>
            
            <div style="background: #e5e7eb; padding: 15px; border-radius: 5px; margin: 20px 0;">
              <p style="margin: 0; font-weight: bold;">Your Request Summary:</p>
              <p style="margin: 10px 0 0 0; font-size: 14px;">${lead.inquiry || 'Awaiting your specific requirements'}</p>
            </div>
            
            <p>If you have any urgent questions, please don't hesitate to contact us at <strong>${process.env.SALES_EMAIL}</strong> or call us at <strong>+63 XXX XXX XXXX</strong>.</p>
            
            <a href="${process.env.NEXT_PUBLIC_APP_URL}" class="button">Visit Our Website →</a>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Your Company. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  });
}