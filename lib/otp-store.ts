// lib/otp-store.ts
export interface OTPRecord {
  otp: string;
  expiresAt: number;
}

class OTPStore {
  private store = new Map<string, OTPRecord>();

  set(email: string, otp: string, expiresInMs: number = 10 * 60 * 1000) { // 10 minutes default
    this.store.set(email, {
      otp,
      expiresAt: Date.now() + expiresInMs
    });
  }

  get(email: string): OTPRecord | undefined {
    return this.store.get(email);
  }

  delete(email: string) {
    this.store.delete(email);
  }

  isValid(email: string, otp: string): boolean {
    const record = this.get(email);
    if (!record) return false;
    
    if (Date.now() > record.expiresAt) {
      this.delete(email);
      return false;
    }
    
    return record.otp === otp;
  }

  // Clean up expired OTPs
  cleanup() {
    const now = Date.now();
    for (const [email, record] of this.store.entries()) {
      if (now > record.expiresAt) {
        this.store.delete(email);
      }
    }
  }
}

export const otpStore = new OTPStore();