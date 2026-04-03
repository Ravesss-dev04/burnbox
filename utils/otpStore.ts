// utils/otp.ts

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
};

// Add this:
export const otpStore = new Map<string, { otp: string; expires: number }>();