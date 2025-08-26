import React from "react";
import {
  usePharmacyApplication,
  STEPS,
} from "../../../contexts/PharmacyApplicationContext";
import { StepSideBar } from "../../ui";
import {
  User,
  Mail,
  Building2,
  MapPin,
  FileText,
  Image,
  CreditCard,
  CheckCircle,
} from "lucide-react";

const PharmacySidebar = () => {
  const {
    activeStep,
    visitedSteps,
    isStepCompleted,
    getStepTitle,
    getStepSubtitle,
  } = usePharmacyApplication();

  const steps = [
    {
      id: STEPS.BASIC_USER_INFO,
      title: getStepTitle(STEPS.BASIC_USER_INFO),
      description: getStepSubtitle(STEPS.BASIC_USER_INFO),
      icon: <User size={20} />,
      completed: isStepCompleted(STEPS.BASIC_USER_INFO),
    },
    {
      id: STEPS.EMAIL_VERIFICATION,
      title: getStepTitle(STEPS.EMAIL_VERIFICATION),
      description: getStepSubtitle(STEPS.EMAIL_VERIFICATION),
      icon: <Mail size={20} />,
      completed: isStepCompleted(STEPS.EMAIL_VERIFICATION),
    },
    {
      id: STEPS.PHARMACY_INFO,
      title: getStepTitle(STEPS.PHARMACY_INFO),
      description: getStepSubtitle(STEPS.PHARMACY_INFO),
      icon: <Building2 size={20} />,
      completed: isStepCompleted(STEPS.PHARMACY_INFO),
    },
    {
      id: STEPS.ADDRESS_LOCATION,
      title: getStepTitle(STEPS.ADDRESS_LOCATION),
      description: getStepSubtitle(STEPS.ADDRESS_LOCATION),
      icon: <MapPin size={20} />,
      completed: isStepCompleted(STEPS.ADDRESS_LOCATION),
    },
    {
      id: STEPS.DOCUMENTS,
      title: getStepTitle(STEPS.DOCUMENTS),
      description: getStepSubtitle(STEPS.DOCUMENTS),
      icon: <FileText size={20} />,
      completed: isStepCompleted(STEPS.DOCUMENTS),
    },
    {
      id: STEPS.IMAGES,
      title: getStepTitle(STEPS.IMAGES),
      description: getStepSubtitle(STEPS.IMAGES),
      icon: <Image size={20} />,
      completed: isStepCompleted(STEPS.IMAGES),
    },
    {
      id: STEPS.PAYMENT_DELIVERY,
      title: getStepTitle(STEPS.PAYMENT_DELIVERY),
      description: getStepSubtitle(STEPS.PAYMENT_DELIVERY),
      icon: <CreditCard size={20} />,
      completed: isStepCompleted(STEPS.PAYMENT_DELIVERY),
    },
    {
      id: STEPS.REVIEW_SUBMIT,
      title: getStepTitle(STEPS.REVIEW_SUBMIT),
      description: getStepSubtitle(STEPS.REVIEW_SUBMIT),
      icon: <CheckCircle size={20} />,
      completed: isStepCompleted(STEPS.REVIEW_SUBMIT),
    },
  ];

  return (
    <StepSideBar
      steps={steps}
      visitedSteps={visitedSteps}
      currentStep={activeStep}
      homePath="/"
      displayLogo={false}
    />
  );
};

export default PharmacySidebar;
