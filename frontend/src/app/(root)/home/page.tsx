"use client";

import React from "react";
import HeroSection from "../../../components/home/HeroSection";
import StepsSection from "../../../components/home/StepsSection";
import SymptomsSection from "../../../components/home/SymptomsSection";
import ServicesSection from "../../../components/home/ServicesSection";
import SpecialtiesSection from "../../../components/home/SpecialtiesSection";
import DoctorLinkSection from "../../../components/home/DoctorLinkSection";
import TestimonialsSection from "../../../components/home/TestimonialsSection";
import QASection from "../../../components/home/QASection";
import { HomeProvider } from "../../../contexts";

export default function HomePage() {
  return (
    <HomeProvider>
      <HeroSection />
      <StepsSection />
      <SymptomsSection />
      <ServicesSection />
      <SpecialtiesSection />
      <DoctorLinkSection />
      <TestimonialsSection />
      <QASection />
    </HomeProvider>
  );
}
