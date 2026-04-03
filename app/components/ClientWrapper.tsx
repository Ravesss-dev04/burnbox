"use client";

import React from "react";
import Header from "./Header";
import { HeaderProvider } from "../context/HeaderContext";

export default function ClientWrapper({ children }: { children: React.ReactNode }) {
  return (
    <HeaderProvider>
      <Header />
      {children}
    </HeaderProvider>
  );
}
