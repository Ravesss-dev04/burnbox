import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // your SMTP host (e.g., smtp.gmail.com)
  port: Number(process.env.EMAIL_PORT), // your SMTP port (587 for TLS, 465 for SSL)
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // your email user (e.g., username@gmail.com)
    pass: process.env.EMAIL_PASS, // your email password
  },
});

const sendOtpEmail = async (email: string, name: string, otp: string) => {
  try {
    await transporter.sendMail({
      from: `"Burnbox Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Burnbox: Account Sign-Up Verification",
      html: `
        <div style="font-family: system-ui, sans-serif, Arial; font-size: 12px">
          <div style="padding: 15px 0;">
            <table role="presentation">
              <tr>
                <td style="vertical-align: top; text-align: center">
                  <div style="padding: 6px 10px; margin: 0 10px; border-radius: 5px;" role="img">
                    <img src="https://github.com/burnboxprinting/ontap-website/raw/main/logo-ontap.png" alt="ontap-logo"/>
                  </div>
                </td>
              </tr>
              <tr>
                <td style="vertical-align: top">
                  <p>Hi <strong>${name}</strong>,</p>
                  <p>Welcome to OnTap Creatives, we're excited to have you on board!</p>
                  <p>To complete your registration and verify your email address, please use the One-Time Code (OTC) below:</p>
                  <br><br>
                  <div style="text-align:center; font-size:24px; font-weight:bold; letter-spacing:6px; color:#2E86C1; margin: 20px 0;">${otp}</div>
                  <br>
                  <p>
                    This code is valid for 10 minutes and can only be used once.
                    <br/><br/>
                    If you didn't request this, you can safely ignore this message, no further action will be taken.
                  </p>
                  <br><br>
                  <p style="padding-bottom: 20px">
                    Best regards,<br>
                    <strong>The OnTap Creatives Team</strong>
                  </p>
                  <p style="color: #2E86C1; font-size: 12px; padding: 10px 0px; border-top: 1px solid #2E86C1">
                    This is an automated message. Please do not reply to this email.
                  </p>
                </td>
              </tr>
            </table>
          </div>
        </div>`,
    });

    return { success: true, message: "OTP sent to email" };
  } catch (err) {
    console.error("Failed to send OTP:", err);
    return { success: false, message: "Failed to send email" };
  }
};

export { sendOtpEmail };
