'use client';

import React from 'react';
import Upcoming from '@/components/ui/Upcoming';

export default function DoctorPatientsPage() {
  const patientFeatures = [
    'Comprehensive patient management dashboard',
    'Medical history and health records access',
    'Treatment progress tracking and analytics',
    'Prescription history and medication tracking',
    'Appointment history and upcoming visits',
    'Patient communication and messaging',
    'Health metrics visualization and trends',
    'Care plan creation and management',
    'Referral tracking and specialist coordination',
    'Patient satisfaction and outcome metrics'
  ];

  return (
    <Upcoming
      title="My Patients"
      description="Comprehensive patient management system. Track medical histories, monitor treatment progress, manage care plans, and maintain detailed health records."
      features={patientFeatures}
      expectedDate="3-4 weeks"
      colorTheme="purple"
      progressPercentage={45}
      additionalInfo="Priority: High - Advanced patient management features"
    />
  );
}