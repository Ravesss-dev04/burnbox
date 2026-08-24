'use client';

import React, { useRef, useState } from 'react';
import { RiMailSendLine } from 'react-icons/ri';
import Image from 'next/image';
import { FaFacebook, FaViber } from 'react-icons/fa';

type ContactEmailFormProps = {
  onSuccess?: () => void;
  className?: string;
};

const ContactEmailForm = ({ onSuccess, className = '' }: ContactEmailFormProps) => {
  const [formData, setFormData] = useState({ email: '', message: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const honeypotRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const resetAfterSuccess = () => {
    setFormData({ email: '', message: '' });
    setIsSent(false);
    onSuccess?.();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (honeypotRef.current && honeypotRef.current.value !== '') {
      setIsSent(true);
      setTimeout(resetAfterSuccess, 2000);
      return;
    }

    if (!formData.email || !formData.message) {
      alert('Please fill in all fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      alert('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          message: formData.message,
          timestamp: Date.now(),
          source: 'website-contact-form',
        }),
      });
      const result = await response.json();
      if (response.ok) {
        setIsSent(true);
        setTimeout(resetAfterSuccess, 2000);
      } else {
        throw new Error(result.message || 'Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      <div className="w-full backdrop-blur-2xl bg-[#231F20]/55 border border-[#FF0060]/30 shadow-[0_20px_50px_rgba(35,31,32,0.35),0_0_40px_rgba(255,0,96,0.12)] rounded-2xl p-6 overflow-hidden relative">
        <div className="absolute -top-16 -right-16 w-52 h-52 bg-[#FF0060]/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-16 w-48 h-48 bg-[#F7F1EA]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#FF0060]/20 via-transparent to-[#231F20]/30 pointer-events-none" />

        <div className="flex items-center gap-3 mb-6 relative z-10">
          <div className="p-2 bg-[#FF0060]/15 rounded-lg border border-[#FF0060]/25">
            <Image
              height={20}
              width={20}
              alt="gmail icon"
              src="/gmail.png"
              className="w-5 h-5 object-contain"
            />
          </div>
          <h2 className="text-[#F7F1EA] font-medium text-sm tracking-wide">
            Reach us out via gmail.
          </h2>
        </div>

        <form className="flex flex-col gap-4 relative z-10" onSubmit={handleSubmit}>
          <input
            type="text"
            name="website"
            ref={honeypotRef}
            className="absolute opacity-0 pointer-events-none h-0 w-0"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
          />

          <div className="space-y-4">
            <input
              type="email"
              name="email"
              placeholder="Input your email address"
              className="w-full bg-[#231F20]/40 border border-[#FF0060]/20 rounded-xl px-4 py-3 text-sm text-[#F7F1EA] placeholder:text-[#F7F1EA]/35 focus:outline-none focus:border-[#FF0060]/60 focus:bg-[#231F20]/55 focus:shadow-[0_0_0_3px_rgba(255,0,96,0.15)] transition-all"
              value={formData.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
            <textarea
              name="message"
              placeholder="Write us a message..."
              className="w-full h-32 bg-[#231F20]/40 border border-[#FF0060]/20 rounded-xl px-4 py-3 text-sm text-[#F7F1EA] placeholder:text-[#F7F1EA]/35 focus:outline-none focus:border-[#FF0060]/60 focus:bg-[#231F20]/55 focus:shadow-[0_0_0_3px_rgba(255,0,96,0.15)] transition-all resize-none"
              value={formData.message}
              onChange={handleChange}
              required
              minLength={5}
            />
          </div>

          <div className="flex justify-end mt-2">
            <button
              type="submit"
              disabled={isLoading || isSent}
              className={`
                flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl
                bg-[#FF0060] hover:bg-[#231F20] hover:border-[#231F20] border-[1.5px] border-[#FF0060] active:scale-95
                text-white font-medium text-sm shadow-lg shadow-[#FF0060]/35
                transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed
                ${isSent ? 'w-14' : 'w-auto'}
              `}
            >
              {isSent ? (
                <Image
                  src="/EmailSent.gif"
                  alt="Sent"
                  width={24}
                  height={24}
                  className="w-6 h-6"
                />
              ) : (
                <>
                  <RiMailSendLine className="text-lg" />
                  <span>{isLoading ? 'Sending...' : 'Send'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="w-full backdrop-blur-2xl bg-[#231F20]/55 border border-[#FF0060]/25 shadow-[0_12px_40px_rgba(35,31,32,0.3),0_0_28px_rgba(255,0,96,0.1)] rounded-2xl p-4 flex items-center justify-between relative overflow-hidden gap-3">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FF0060]/15 via-transparent to-[#F7F1EA]/05 pointer-events-none" />
        <span className="text-[#F7F1EA]/55 text-sm font-medium relative z-10 shrink">
          other ways to contact us
        </span>
        <div className="flex items-center gap-3 relative z-10">
          <a
            href="https://facebook.com/burnboxprinting"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-[#1877F2]/15 hover:bg-[#1877F2]/30 text-[#1877F2] border border-[#1877F2]/20 transition-all hover:scale-110"
            aria-label="Facebook"
          >
            <FaFacebook className="text-xl" />
          </a>
          <a
            href="https://www.instagram.com/burnboxprinting/"
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-[#FF0060]/15 hover:bg-[#FF0060]/30 border border-[#FF0060]/25 transition-all hover:scale-110"
            aria-label="Instagram"
          >
            <Image
              height={20}
              width={20}
              alt="instagram"
              src="/instagram.png"
              className="w-5 h-5 object-contain"
            />
          </a>
          <a
            href="viber://chat?number=+639177008364"
            className="p-2 rounded-lg bg-[#7360f2]/15 hover:bg-[#7360f2]/30 text-[#7360f2] border border-[#7360f2]/20 transition-all hover:scale-110"
            aria-label="Viber"
          >
            <FaViber className="text-xl" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ContactEmailForm;
