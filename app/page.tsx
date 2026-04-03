"use client";
import { Suspense, useEffect, useState } from "react";
import MainPage from "./components/MainPage";
import SmoothScrollWrapper from "./components/SmoothScrollWrapper";

export default function Home() {
  return (
    <SmoothScrollWrapper>
      <main className="h-full max-w-full flex flex-col bg-black relative overflow-x-hidden p-0 m-0">
        <MainPage/>
      </main>
    </SmoothScrollWrapper>
  ); 
}

