'use client';

import React from 'react';
import Upcoming from '@/components/ui/Upcoming';

export default function PatientMedicationsPage() {
  const medicationFeatures = [
    'View all current and past medications',
    'Medication adherence tracking and reminders',
    'Prescription refill requests and management',
    'Pharmacy location finder and recommendations',
    'Drug information and side effect warnings',
    'Medication interaction checker',
    'Dosage instructions and scheduling',
    'Insurance coverage and cost information',
    'Medication delivery tracking',
    'Health progress correlation with medications'
  ];

  return (
    <Upcoming
      title="My Medications"
      description="Comprehensive medication management for patients. Track prescriptions, set reminders, find pharmacies, monitor adherence, and stay informed about your medications."
      features={medicationFeatures}
      expectedDate="3-4 weeks"
      colorTheme="emerald"
      progressPercentage={40}
      additionalInfo="Priority: High - Patient medication tracking and adherence"
    />
  );
}