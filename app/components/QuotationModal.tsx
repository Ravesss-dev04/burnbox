// components/QuotationModal.tsx
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';

// Form validation schema with updated contact number validation
const quotationSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters').regex(/^[a-zA-Z\s]+$/, 'Full name can only contain letters and spaces'),
  contactNumber: z.string()
    .min(10, 'Contact number must be at least 10 digits')
    .max(11, 'Contact number must not exceed 11 digits')
    .regex(/^9\d{9,10}$/, 'Contact number must start with 9 and contain only numbers (e.g., 9123456789)'),
  email: z.string()
    .email('Invalid email address'),
  companyName: z.string()
    .min(2, 'Company name must be at least 2 characters'),
  inquiry: z.string().optional(),
});

type QuotationFormData = z.infer<typeof quotationSchema>;

interface QuotationModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  config?: {
    primaryColor?: string;
  };
}

export default function QuotationModal({ config }: QuotationModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
    trigger,
  } = useForm<QuotationFormData>({
    resolver: zodResolver(quotationSchema),
  });

  const onSubmit = async (data: QuotationFormData) => {
    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('Quotation request submitted!', {
          description: 'Our sales team will contact you shortly.',
        });
        reset();
      } else {
        throw new Error(result.error || 'Something went wrong');
      }
    } catch (error) {
      toast.error('Failed to submit', {
        description: error instanceof Error ? error.message : 'Please try again later',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle contact number input - only allow numbers and enforce starting with 9
  const handleContactNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    
    // Remove any non-digit characters
    value = value.replace(/\D/g, '');
    
    // If value is not empty and first character is not '9', clear it or set to '9'
    if (value.length > 0 && value[0] !== '9') {
      value = '9' + value.slice(1);
    }
    
    // Limit to 11 digits (Philippine mobile number length)
    if (value.length > 11) {
      value = value.slice(0, 11);
    }
    
    setValue('contactNumber', value);
    trigger('contactNumber');
  };

  const primaryColor = config?.primaryColor || 'var(--color-pink, #ff0060)';

  return (
    <section className="relative w-full min-h-screen overflow-hidden px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, rgba(255, 0, 96, 0.08), rgba(232, 155, 176, 0.05))',
        }}
      />
      <div
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full blur-3xl"
        style={{ backgroundColor: config?.primaryColor || '#ff0060', opacity: 0.16 }}
      />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-80 w-80 rounded-full bg-white/5 blur-3xl" />

      <div className="relative mx-auto max-w-3xl">
        <div className="rounded-3xl border border-white/10 bg-zinc-950/80 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8 md:p-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white sm:text-4xl">Request a Quotation</h1>
            <p className="mt-2 text-sm leading-relaxed text-zinc-300 sm:text-base">
              Tell us what you need and our sales team will contact you shortly.
            </p>
          </div>
          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {/* Full Name */}
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-200">
                  Full Name *
                </label>
                <input 
                  type="text"
                  {...register('fullName')}
                  className={`w-full rounded-xl border bg-white/5 px-4 py-3 text-white placeholder:text-zinc-500 outline-none transition-all duration-200 focus:border-pink-500/70 focus:ring-2 focus:ring-pink-500/30 ${errors.fullName ? 'border-red-500/80' : 'border-white/15'}`}
                  placeholder="John Doe"
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-400">{errors.fullName.message}</p>
                )}
              </div>
              
              {/* Contact Number - Updated with validation */}
              <div>
                <label className="mb-1 block text-sm font-medium text-zinc-200">
                  Contact Number *
                </label>
                <input
                  type="tel"
                  placeholder="+63 912 345 6789"
                  {...register('contactNumber')}
                  onChange={handleContactNumberChange}
                  inputMode="numeric"
                  pattern="[0-9]*"
                  className={`w-full rounded-xl border bg-white/5 px-4 py-3 text-white placeholder:text-zinc-500 outline-none transition-all duration-200 focus:border-pink-500/70 focus:ring-2 focus:ring-pink-500/30 ${
                    errors.contactNumber ? 'border-red-500/80' : 'border-white/15'
                  }`}
                />
                {errors.contactNumber && (
                  <p className="mt-1 text-sm text-red-400">{errors.contactNumber.message}</p>
                )}
               
              </div>
            </div>
            {/* Email */}
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-200">
                Email Address 
              </label>
              <input
                type="email"
                placeholder="company@example.com"
                {...register('email')}
                className={`w-full rounded-xl border bg-white/5 px-4 py-3 text-white placeholder:text-zinc-500 outline-none transition-all duration-200 focus:border-pink-500/70 focus:ring-2 focus:ring-pink-500/30 ${
                  errors.email ? 'border-red-500/80' : 'border-white/15'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Company Name */}
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-200">
                Company Name <span className='text-sm'>(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="Your Company Inc."
                {...register('companyName')}
                className={`w-full rounded-xl border bg-white/5 px-4 py-3 text-white placeholder:text-zinc-500 outline-none transition-all duration-200 focus:border-pink-500/70 focus:ring-2 focus:ring-pink-500/30 ${
                  errors.companyName ? 'border-red-500/80' : 'border-white/15'
                }`}
              />
              {errors.companyName && (
                <p className="mt-1 text-sm text-red-400">{errors.companyName.message}</p>
              )}
            </div>

            {/* Inquiry */}
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-200">
                Inquiry Details
              </label>
              <textarea
                rows={4}
                placeholder="Please describe what you need..."
                {...register('inquiry')}
                className="w-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-white placeholder:text-zinc-500 outline-none transition-all duration-200 focus:border-pink-500/70 focus:ring-2 focus:ring-pink-500/30"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                backgroundColor: primaryColor,
                boxShadow: `0 10px 30px ${config?.primaryColor ? `${config.primaryColor}55` : 'rgba(255,0,96,0.35)'}`,
              }}
              className="w-full rounded-xl py-3 text-white font-semibold transition-all duration-300 hover:-translate-y-0.5 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Submitting...
                </span>
              ) : (
                'Submit Quotation Request'
              )}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-zinc-400">
            By submitting, you agree to our terms and privacy policy.
          </p>
        </div>
      </div>
    </section>
  );
}