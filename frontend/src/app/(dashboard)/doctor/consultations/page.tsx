'use client';

import React from 'react';
import Upcoming from '@/components/ui/Upcoming';

export default function DoctorConsultationsPage() {
  const consultationFeatures = [
    'Unified consultation hub for all appointment types',
    'Real-time video consultations with HD quality',
    'Secure chat messaging during consultations', 
    'AI-powered transcription and note-taking',
    'Digital prescription writing and management',
    'Patient medical history integration',
    'Screen sharing for medical document review',
    'Recording and playback for follow-up care',
    'Multi-language support and translation',
    'Emergency consultation protocols'
  ];

  return (
    <Upcoming
      title="Consultations Hub"
      description="Your unified consultation management center. Conduct video calls, chat sessions, manage prescriptions, and access patient history all in one seamless interface."
      features={consultationFeatures}
      expectedDate="Next 2 weeks"
      colorTheme="blue"
      progressPercentage={75}
      additionalInfo="Priority: Critical - Core feature for medical consultations"
    />
  );
}