import React from "react";
import Button from "./Button";

interface StepNavButtonsProps {
  onBack?: (() => void) | null;
  onContinue?: (() => void) | null;
  canContinue: boolean;
  isLoading: boolean;
  onBackText?: string;
  onContinueText?: string;
}

export default function StepNavButtons({
  onBack = null,
  onContinue = null,
  canContinue,
  isLoading,
  onBackText,
  onContinueText,
}: StepNavButtonsProps) {
  return (
    <div
      className={`flex ${
        onBack ? "justify-between" : "justify-end"
      } mt-6 gap-5 sm:gap-0 sm:mt-8 w-full`}
    >
      {onBack && (
        <Button
          type="button"
          id="back-btn"
          additionalClasses="w-full sm:w-auto border border-line_clr text-secondary text-sm"
          onClickHandler={onBack}
          isDisabled={isLoading}
        >
          {onBackText || "Back"}
        </Button>
      )}

      <Button
        type="submit"
        id="continue-btn"
        additionalClasses="w-full sm:w-auto secondarybtn text-sm"
        onClickHandler={onContinue}
        isDisabled={isLoading || !canContinue}
        isLoading={isLoading}
      >
        {onContinueText || "Continue"}
      </Button>
    </div>
  );
}
