'use client';

import React from 'react';
import Upcoming from '@/components/ui/Upcoming';

export default function DoctorPrescriptionsPage() {
  const prescriptionFeatures = [
    'Digital prescription creation and management',
    'Drug interaction warnings and alerts',
    'Pharmacy network integration and recommendations',
    'Prescription tracking and fulfillment status',
    'Patient medication adherence monitoring',
    'Electronic prescription transmission (eRx)',
    'Prescription history and analytics',
    'Controlled substance management',
    'Insurance formulary checking',
    'Prescription renewal and refill management'
  ];

  return (
    <Upcoming
      title="Prescriptions & Pharmacy"
      description="Complete prescription management system with pharmacy integration. Create digital prescriptions, track fulfillment, monitor patient adherence, and coordinate with pharmacy partners."
      features={prescriptionFeatures}
      expectedDate="3-4 weeks"
      colorTheme="indigo"
      progressPercentage={40}
      additionalInfo="Priority: High - Integration with pharmacy network required"
    />
  );
}