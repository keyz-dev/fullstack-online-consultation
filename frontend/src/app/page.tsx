"use client";

import React from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import HeroSection from "../components/home/HeroSection";
import StepsSection from "../components/home/StepsSection";
import SymptomsSection from "../components/home/SymptomsSection";
import ServicesSection from "../components/home/ServicesSection";
import SpecialtiesSection from "../components/home/SpecialtiesSection";
import DoctorLinkSection from "../components/home/DoctorLinkSection";
import TestimonialsSection from "../components/home/TestimonialsSection";
import QASection from "../components/home/QASection";
import { HomeProvider } from "../contexts";

export default function Home() {
  return (
    <HomeProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <HeroSection />
          <StepsSection />
          <SymptomsSection />
          <ServicesSection />
          <SpecialtiesSection />
          <DoctorLinkSection />
          <TestimonialsSection />
          <QASection />
        </main>
        <Footer />
      </div>
    </HomeProvider>
  );
}
