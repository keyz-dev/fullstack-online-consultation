'use client';

import React from 'react';
import Upcoming from '@/components/ui/Upcoming';

export default function PatientConsultationsPage() {
  const consultationFeatures = [
    'Join video consultations with your doctors',
    'Access chat sessions and message history',
    'View and download consultation recordings',
    'Receive digital prescriptions instantly',
    'Track consultation history and outcomes',
    'Upload medical documents and test results',
    'Rate and review your consultation experience',
    'Schedule follow-up appointments directly',
    'Access health education resources',
    'Emergency consultation request button'
  ];

  return (
    <Upcoming
      title="My Consultations"
      description="Access all your medical consultations in one place. Join video calls, review chat history, manage prescriptions, and track your health journey."
      features={consultationFeatures}
      expectedDate="Next 2 weeks"
      colorTheme="green"
      progressPercentage={75}
      additionalInfo="Priority: Critical - Essential for patient care access"
    />
  );
}