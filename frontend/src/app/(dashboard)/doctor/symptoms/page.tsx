'use client';

import React from 'react';
import Upcoming from '@/components/ui/Upcoming';

export default function DoctorSymptomsPage() {
  const symptomFeatures = [
    'Comprehensive symptom database and search',
    'AI-powered diagnostic assistance and suggestions',
    'Symptom pattern recognition and analysis',
    'Differential diagnosis support tools',
    'Clinical decision support system',
    'Evidence-based treatment recommendations',
    'Symptom severity assessment tools',
    'Patient symptom tracking integration',
    'Medical literature and research access',
    'Specialty-specific symptom guidelines'
  ];

  return (
    <Upcoming
      title="Symptoms & Diagnosis"
      description="Advanced symptom analysis and diagnostic support system. Access comprehensive medical knowledge, AI-powered insights, and evidence-based treatment recommendations."
      features={symptomFeatures}
      expectedDate="5-6 weeks"
      colorTheme="red"
      progressPercentage={25}
      additionalInfo="Priority: Medium - Advanced diagnostic support tools"
    />
  );
}