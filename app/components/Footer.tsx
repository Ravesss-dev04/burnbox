import { FaPaypal, FaFacebook } from "react-icons/fa";
import { FaSquareInstagram } from "react-icons/fa6";
import React from 'react';
import Image from "next/image";
import { useSiteConfig } from "../context/SiteConfigContext";
import Editable from "./Editable";

const Footer = () => {
  const { config } = useSiteConfig();

  return (
    <footer className="bg-zinc-950 text-white px-6 sm:px-10 py-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 text-sm font-extralight w-full">
          {/* Column 1: Quick Links */}
          <div>
            <Editable 
              name="footerQuickLinksTitle" 
              as="h4" 
              type="text"
              defaultValue="Quick Links"
              className="text-lg font-semibold mb-2"
              style={{ color: config.primaryColor || '#f472b6' }}
            />
            <Editable name="footerLink1" as="p" type="text" defaultValue="Offset Printing / Forms & Receipt" />
            <Editable name="footerLink2" as="p" type="text" defaultValue="Corporate Giveaways" />
            <Editable name="footerLink3" as="p" type="text" defaultValue="Stickers & Labels" />
            <Editable name="footerLink4" as="p" type="text" defaultValue="Signage" />
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="text-lg font-semibold mb-2 invisible">Spacer</h4>
            <Editable name="footerLink5" as="p" type="text" defaultValue="Marketing Collaterals" />
            <Editable name="footerLink6" as="p" type="text" defaultValue="Wall Mural" />
            <Editable name="footerLink7" as="p" type="text" defaultValue="Glass/Frosted Sticker" />
            <Editable name="footerLink8" as="p" type="text" defaultValue="Transit Ads / Vehicle Warpping" />
          </div>
          {/* Column 3 */}
          <div>
            <h4 className="text-lg font-semibold mb-2 invisible">Spacer</h4>
            <Editable name="footerLink9" as="p" type="text" defaultValue="Graphic Design" />
            <Editable name="footerLink10" as="p" type="text" defaultValue="Logo Design" />
            <Editable name="footerLink11" as="p" type="text" defaultValue="Light Box" />
            <Editable name="footerLink12" as="p" type="text" defaultValue="Other Services" />
          </div>

          
          {/* Column 4: Follow Us */}
          <div>
            <Editable 
              name="footerFollowUsTitle" 
              as="h4" 
              type="text"
              defaultValue="Follow Us"
              className="text-lg font-semibold"
              style={{ color: config.primaryColor || '#f472b6' }}
            />
            <div className="flex space-x-4 text-2xl mt-2">
              <a href={config.facebookUrl || "https://www.facebook.com/photo/?fbid=1237045431770415&set=a.469292898545676"} target="_blank" rel="noopener noreferrer">
                <FaFacebook className="bg-[#1877F2] rounded-full w-6 h-6" />
              </a>
              <a href={config.instagramUrl || "#"} target="_blank" rel="noopener noreferrer">
                <Image
                  height={500}
                  width={500}
                  alt="Instagram"
                  src="/instagram.png"
                  className="h-6 w-6 object-contain"
                />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10 mt-8 pt-4 flex justify-center items-center text-sm text-gray-400">
        <Editable 
          name="footerCopyright" 
          as="p" 
          type="text"
          defaultValue="Privacy Policy | Terms of Service | Contact info@burnbox.com | @ 2025 burnbox Printing company"
          className="text-center"
        />
      </div>
    </footer>
  );
};

export default Footer;
