import React from "react";
import {
  User as LucideUser,
  Mail,
  Stethoscope,
  MapPin,
  FileText,
  CreditCard,
  CheckCircle,
  Award,
  Building,
} from "lucide-react";
import { StepSideBar } from "@/components/ui";
import { useDoctorApplication } from "@/contexts/DoctorApplicationContext";

interface DoctorSidebarProps {
  currentStep: number;
  visitedSteps: number[];
}

const DoctorSidebar: React.FC<DoctorSidebarProps> = ({
  currentStep,
  visitedSteps,
}) => {
  const { STEPS, getStepTitle, getStepSubtitle, isStepCompleted } =
    useDoctorApplication();

  const steps = [
    {
      id: STEPS.BASIC_USER_INFO,
      icon: <LucideUser size={20} />,
      title: getStepTitle(STEPS.BASIC_USER_INFO),
      description: getStepSubtitle(STEPS.BASIC_USER_INFO),
      completed: isStepCompleted(STEPS.BASIC_USER_INFO),
    },
    {
      id: STEPS.EMAIL_VERIFICATION,
      icon: <Mail size={20} />,
      title: getStepTitle(STEPS.EMAIL_VERIFICATION),
      description: getStepSubtitle(STEPS.EMAIL_VERIFICATION),
      completed: isStepCompleted(STEPS.EMAIL_VERIFICATION),
    },
    {
      id: STEPS.PROFESSIONAL_INFO,
      icon: <Award size={20} />,
      title: getStepTitle(STEPS.PROFESSIONAL_INFO),
      description: getStepSubtitle(STEPS.PROFESSIONAL_INFO),
      completed: isStepCompleted(STEPS.PROFESSIONAL_INFO),
    },
    {
      id: STEPS.SPECIALTIES,
      icon: <Stethoscope size={20} />,
      title: getStepTitle(STEPS.SPECIALTIES),
      description: getStepSubtitle(STEPS.SPECIALTIES),
      completed: isStepCompleted(STEPS.SPECIALTIES),
    },
    {
      id: STEPS.ADDRESS_LOCATION,
      icon: <MapPin size={20} />,
      title: getStepTitle(STEPS.ADDRESS_LOCATION),
      description: getStepSubtitle(STEPS.ADDRESS_LOCATION),
      completed: isStepCompleted(STEPS.ADDRESS_LOCATION),
    },
    {
      id: STEPS.DOCUMENTS,
      icon: <FileText size={20} />,
      title: getStepTitle(STEPS.DOCUMENTS),
      description: getStepSubtitle(STEPS.DOCUMENTS),
      completed: isStepCompleted(STEPS.DOCUMENTS),
    },
    {
      id: STEPS.PAYMENT_SETUP,
      icon: <CreditCard size={20} />,
      title: getStepTitle(STEPS.PAYMENT_SETUP),
      description: getStepSubtitle(STEPS.PAYMENT_SETUP),
      completed: isStepCompleted(STEPS.PAYMENT_SETUP),
    },
    {
      id: STEPS.REVIEW,
      icon: <CheckCircle size={20} />,
      title: getStepTitle(STEPS.REVIEW),
      description: getStepSubtitle(STEPS.REVIEW),
      completed: isStepCompleted(STEPS.REVIEW),
    },
  ];

  return (
    <StepSideBar
      currentStep={currentStep}
      visitedSteps={visitedSteps}
      steps={steps}
      homePath="/"
      displayLogo={false}
    />
  );
};

export default DoctorSidebar;
