"use client";

import { FaFacebook } from "react-icons/fa";
import React from "react";
import Image from "next/image";
import { useSiteConfig } from "../context/SiteConfigContext";
import Editable from "./Editable";

const Footer = () => {
  const { config } = useSiteConfig();
  const headingAccent = "#C9B896";

  return (
    <footer className="bg-[#171414] text-[#B7AFA6] px-6 sm:px-10 pt-14 pb-7 text-[13.5px] border-t border-white/5">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.6fr_repeat(4,1fr)] gap-8 lg:gap-8 mb-12">
          {/* Brand + Contact */}
          <div className="sm:col-span-2 lg:col-span-1">
            <div className="text-white text-xl font-black uppercase tracking-tight mb-3.5">
              BURNBOX
            </div>
            <p className="max-w-[240px] leading-relaxed mb-6 text-[#B7AFA6]">
              Helping business owners grow through offline and online advertising — since 2015.
            </p>

            <h5
              className="text-[11px] uppercase tracking-[0.08em] font-medium mb-4"
              style={{ color: headingAccent }}
            >
              Contact
            </h5>
            <ul className="space-y-2.5 text-white/90">
              <li>
                <a href="tel:+639177008364" className="hover:opacity-80 transition-opacity">
                  +63 917 700 8364
                </a>
              </li>
              <li>
                <a href="tel:+63270072412" className="hover:opacity-80 transition-opacity">
                  (02) 7007 2412
                </a>
              </li>
              <li>
                <a
                  href={
                    config.facebookUrl ||
                    "https://www.facebook.com/burnboxprinting"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                >
                  facebook.com/burnboxprinting
                </a>
              </li>
              <li>
                <a
                  href="https://burnboxadvertising.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:opacity-80 transition-opacity"
                >
                  burnboxadvertising.com
                </a>
              </li>
            </ul>

            {/* Existing Follow Us social icons — preserved */}
            <div className="mt-5">
              <Editable
                name="footerFollowUsTitle"
                as="h5"
                type="text"
                defaultValue="Follow Us"
                className="text-[11px] uppercase tracking-[0.08em] font-medium mb-3"
                style={{ color: headingAccent }}
              />
              <div className="flex space-x-4 text-2xl">
                <a
                  href={
                    config.facebookUrl ||
                    "https://www.facebook.com/photo/?fbid=1237045431770415&set=a.469292898545676"
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <FaFacebook className="bg-[#1877F2] rounded-full w-6 h-6" />
                </a>
                <a
                  href={config.instagramUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                >
                  <Image
                    height={24}
                    width={24}
                    alt="Instagram"
                    src="/instagram.png"
                    className="h-6 w-6 object-contain"
                  />
                </a>
              </div>
            </div>
          </div>

          {/* Print & Signage — existing Editable link fields */}
          <div>
            <Editable
              name="footerQuickLinksTitle"
              as="h5"
              type="text"
              defaultValue="Print & Signage"
              className="text-[11px] uppercase tracking-[0.08em] font-medium mb-4"
              style={{ color: headingAccent }}
            />
            <ul className="space-y-2.5 text-white/85">
              <li>
                <Editable name="footerLink1" as="span" type="text" defaultValue="Large Format Printing" />
              </li>
              <li>
                <Editable name="footerLink2" as="span" type="text" defaultValue="Custom Signage" />
              </li>
              <li>
                <Editable name="footerLink3" as="span" type="text" defaultValue="Wall Stickers" />
              </li>
              <li>
                <Editable name="footerLink4" as="span" type="text" defaultValue="Corporate Giveaways" />
              </li>
            </ul>
          </div>

          {/* Digital & Ecommerce */}
          <div>
            <h5
              className="text-[11px] uppercase tracking-[0.08em] font-medium mb-4"
              style={{ color: headingAccent }}
            >
              Digital & Ecommerce
            </h5>
            <ul className="space-y-2.5 text-white/85">
              <li>
                <Editable name="footerLink5" as="span" type="text" defaultValue="Social Media Mgmt." />
              </li>
              <li>
                <Editable name="footerLink6" as="span" type="text" defaultValue="Meta & Google Ads" />
              </li>
              <li>
                <Editable name="footerLink7" as="span" type="text" defaultValue="Online Store Setup" />
              </li>
              <li>
                <Editable name="footerLink8" as="span" type="text" defaultValue="Graphic Design" />
              </li>
            </ul>
          </div>

          {/* 3D & Fabrication */}
          <div>
            <h5
              className="text-[11px] uppercase tracking-[0.08em] font-medium mb-4"
              style={{ color: headingAccent }}
            >
              3D & Fabrication
            </h5>
            <ul className="space-y-2.5 text-white/85">
              <li>
                <Editable name="footerLink9" as="span" type="text" defaultValue="3D Printing" />
              </li>
              <li>
                <Editable name="footerLink10" as="span" type="text" defaultValue="Custom Prototypes" />
              </li>
              <li>
                <Editable name="footerLink11" as="span" type="text" defaultValue="Gondolas" />
              </li>
              <li>
                <Editable name="footerLink12" as="span" type="text" defaultValue="Kiosks" />
              </li>
            </ul>
          </div>

          {/* Also Available + Other Links (kept) */}
          <div>
            <h5
              className="text-[11px] uppercase tracking-[0.08em] font-medium mb-4"
              style={{ color: headingAccent }}
            >
              Also Available
            </h5>
            <ul className="space-y-2.5 text-white/85 mb-6">
              <li>
                <a href="/services" className="hover:text-white transition-colors">
                  Airport Advertising
                </a>
              </li>
              <li>
                <a
                  href="https://ontap.ph"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  On Tap Creatives
                </a>
              </li>
              <li>
                <a
                  href="https://ontap.ph"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  ontap.ph
                </a>
              </li>
            </ul>

            {/* Existing Other Links — preserved */}
            <Editable
              name="footerOtherLinksTitle"
              as="h5"
              type="text"
              defaultValue="Other Links"
              className="text-[11px] uppercase tracking-[0.08em] font-medium mb-3"
              style={{ color: headingAccent }}
            />
            <a
              href="https://www.refrens.com/en/free-accounting-software"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block hover:opacity-80 transition-opacity"
            >
              <Image
                height={40}
                width={100}
                alt="Refresh"
                src="/refresh.png"
                className="h-[40px] w-[100px] object-contain cursor-pointer"
              />
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-xs text-[#7A736D]">
          <Editable
            name="footerCopyright"
            as="p"
            type="text"
            defaultValue="© 2026 Burnbox Advertising Solution. All rights reserved."
            className="text-[#7A736D]"
          />
          <p className="text-[#7A736D]">Privacy Policy - Terms of Service</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
