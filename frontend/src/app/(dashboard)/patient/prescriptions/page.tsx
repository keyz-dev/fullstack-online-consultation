'use client';

import React from 'react';
import Upcoming from '@/components/ui/Upcoming';

export default function PatientPrescriptionsPage() {
  const prescriptionFeatures = [
    'View all digital prescriptions from doctors',
    'Download and print prescription documents',
    'Track prescription fulfillment status',
    'Compare pharmacy prices and locations',
    'Request prescription transfers between pharmacies',
    'View prescription history and archives',
    'Set up automatic refill reminders',
    'Access medication guides and information',
    'Insurance coverage verification',
    'Digital prescription sharing with family/caregivers'
  ];

  return (
    <Upcoming
      title="My Prescriptions"
      description="Digital prescription management hub. Access all your prescriptions, track fulfillment, compare pharmacy options, and manage refills seamlessly."
      features={prescriptionFeatures}
      expectedDate="3-4 weeks"
      colorTheme="blue"
      progressPercentage={40}
      additionalInfo="Priority: High - Digital prescription access for patients"
    />
  );
}