"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, Mail, MapPin, ScanLine } from "lucide-react";

const ContactPages = () => {
  const [showCards, setShowCards] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowCards(true);
    }, 200);
    return () => clearTimeout(timer);
  }, []);

  const contacts = [
    {
      id: "person1",
      name: "JOHANNAH MAE ",
      role: "SALES REPRESENTATIVE",
      phones: ["(02) 7007-2412", "(02) 7373 4602", "+63 977 247 3179", "+63 993 981 9964"],
      email: "johannahmaebantiling2@gmail.com",
      address: "17 Vatican City Dr, BF Resort Village, Talon 2, Las Piñas City",
      image: "/maam.png",
      qr1: "/businessproposalQrcode.png",
      qr2: "/companyprofileQrcode.png",
    },
    {
      id: "person2",
      name: "ALJUN PEREIRA",
      role: "SALES CONSULTANT",
      phones: ["(02) 7007-2412", "(02) 7373 4602",  "+63 928 693 5815"],
      email: "aljun.sales@burnboxprinting.com",
      address: "17 Vatican City Dr, BF Resort Village, Talon 2, Las Piñas City",
      image: "/siraljun.png",
      qr1: "/businessproposalQrcode.png",
      qr2: "/companyprofileQrcode.png",
    },
     {
      id: "person3",
      name: "Timmy Trinidad",
      role: "SALES CONSULTANT",
      phones: ["(02) 7007-2412", "(02) 7373 4602",  "+63 993 342 8358"],
      email: "burnboxtimmy@gmail.com",
      address: "17 Vatican City Dr, BF Resort Village, Talon 2, Las Piñas City",
      image: "/timmy.png",
      qr1: "/businessproposalQrcode.png",
      qr2: "/companyprofileQrcode.png",
    },
  ];

  return (
    <section
      id="Contact"
      className="relative w-full min-h-screen flex flex-col items-center justify-center py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-[#F7F1EA] text-[#231F20] overflow-hidden"
    >
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(35,31,32,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(35,31,32,0.04)_1px,transparent_1px)] bg-[size:32px_32px]" />
        <div className="absolute -top-24 left-1/4 w-[500px] h-[500px] bg-[#FF0060]/[0.07] rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#231F20]/[0.05] rounded-full blur-[120px] translate-y-1/3" />
      </div>
      <div className="relative z-10 w-full max-w-7xl mx-auto flex flex-col items-center">
        {showCards && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12 lg:mb-16"
          >
            <span className="block uppercase tracking-[0.12em] text-xs text-[#FF0060] mb-3.5 font-medium">
              06 / Contact
            </span>
            <h3 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-[#231F20] mb-4">
              Sales Representatives
            </h3>
            <p className="text-[#7A736D] text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
              Connect with our dedicated team for personalized assistance and
              inquiries.
            </p>
          </motion.div>
        )}

        <AnimatePresence>
          {showCards && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full">
              {contacts.map((person, index) => (
                <motion.div
                  key={person.id}
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="group relative bg-[#F7F1EA] border-[1.5px] border-[#231F20]/15 rounded-sm overflow-hidden hover:border-[#FF0060]/40 hover:bg-[#F0E6DA] transition-all duration-500 text-wrap"
                >
                  <div className="absolute inset-0 bg-[#FF0060]/[0.04] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  <div className="relative p-6 sm:p-8 flex flex-col-reverse md:flex-row gap-8 items-center md:items-start h-full">
                    {/* Info Section */}
                    <div className="flex-1 flex flex-col gap-6 w-full">
                      <div>
                        <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#231F20] mb-2 group-hover:text-[#FF0060] transition-colors">
                          {person.name}
                        </h3>
                        <span className="inline-block px-3 py-1 rounded-sm bg-[#FF0060]/10 text-[#FF0060] text-xs sm:text-sm font-semibold border-[1.5px] border-[#FF0060]/25">
                          {person.role}
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-start gap-3 text-[#231F20]">
                          <Phone className="w-5 h-5 text-[#FF0060] mt-1 flex-shrink-0" />
                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-[#7A736D] font-medium uppercase tracking-wider">
                              Phone Numbers
                            </span>
                            {person.phones.map((phone, i) => (
                              <a
                                key={i}
                                href={`tel:${phone.replace(/\D/g, "")}`}
                                className="hover:text-[#FF0060] transition-colors text-sm sm:text-base"
                              >
                                {phone}
                              </a>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-start gap-3 text-[#231F20]">
                          <Mail className="w-5 h-5 text-[#FF0060] mt-1 flex-shrink-0" />
                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-[#7A736D] font-medium uppercase tracking-wider">
                              Email Address
                            </span>
                            <a
                              href={`mailto:${person.email}`}
                              className="hover:text-[#FF0060] transition-colors text-sm sm:text-base break-all"
                            >
                              {person.email}
                            </a>
                          </div>
                        </div>
                        <div className="flex items-start gap-3 text-[#231F20]">
                          <MapPin className="w-5 h-5 text-[#FF0060] mt-1 flex-shrink-0" />
                          <div className="flex flex-col gap-1">
                            <span className="text-xs text-[#7A736D] font-medium uppercase tracking-wider">
                              Office Address
                            </span>
                            <p className="text-sm sm:text-base leading-relaxed text-[#7A736D]">
                              {person.address}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-auto pt-6 border-t border-[#231F20]/10">
                        <div className="flex items-center gap-2 mb-3 text-[#FF0060]">
                          <ScanLine className="w-4 h-4" />
                          <span className="text-xs font-bold uppercase tracking-wider">
                            Scan to Connect
                          </span>
                        </div>
                        <div className="flex gap-4 mb-2 ">
                          <div className="bg-[#F7F1EA] p-2 rounded-sm border-[1.5px] border-[#231F20]/15 relative group ">
                            <img
                              src={person.qr1}
                              alt="QR 1"
                              className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
                            />
                            <span className="absolute top-1/3 left-0  ml-0 px-0 -translate-y-1/4  md:top-1/3 md:left-0 md:ml-0  opacity-0  md:-translate-y-1/4 md:opacity-0 group-hover:opacity-100 md:group-hover:opacity-100 text-wrap text-center transition md:transition bg-[#171414] rounded-sm shadow md:text-nowrap text-sm md:px-1 md:py-1 text-[#F7F1EA]">
                              Business proposal
                            </span>
                          </div>
                          <div className="bg-[#F7F1EA] p-2 rounded-sm border-[1.5px] border-[#231F20]/15 relative group">
                            <img
                              src={person.qr2}
                              alt="QR 2"
                              className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
                            />
                            <span className="absolute top-1/3 left-0  ml-0 px-0 -translate-y-1/4  md:top-1/3 md:left-0 md:ml-0  opacity-0  md:-translate-y-1/4 md:opacity-0 group-hover:opacity-100 md:group-hover:opacity-100 text-wrap text-center transition md:transition bg-[#171414] rounded-sm shadow md:text-nowrap text-sm md:px-1 md:py-1 text-[#F7F1EA]">
                              Company Profile
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-3 mb-2 md:gap-2">
                          <div className="text-[13px]  sm:text-[15px] text-[#FF0060] font-medium ">
                            Business Proposal
                          </div>
                          <div className="text-[13px] sm:text-[15px] text-[#FF0060] font-medium ">
                            Company Profile
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Image Section */}
                    <div className="w-full md:w-2/5 flex justify-center md:justify-end">
                      <div className="relative w-48 h-48 sm:w-64 sm:h-64 md:w-full md:h-[400px] rounded-full md:rounded-none overflow-hidden md:overflow-visible border-[1.5px] border-[#FF0060]/25 md:border-0 bg-[#FF0060]/5 md:bg-none">
                        <img
                          src={person.image}
                          alt={person.name}
                          className="w-full h-full object-cover md:object-contain md:absolute md:bottom-0 md:right-0 md:scale-125 md:translate-y-10 transition-transform duration-500 group-hover:scale-110 md:group-hover:translate-y-6"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};




export default ContactPages;