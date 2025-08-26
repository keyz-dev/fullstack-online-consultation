"use client";

import React from "react";
import { Button } from "@/components/ui";
import { RefreshCw, Plus } from "lucide-react";

interface AvailabilityHeaderProps {
  onRefresh: () => void;
  onAddNew: () => void;
}

export const AvailabilityHeader: React.FC<AvailabilityHeaderProps> = ({
  onRefresh,
  onAddNew,
}) => {
  return (
    <div className="flex items-center justify-end">
      <div className="flex items-center space-x-3">
        <Button
          onClickHandler={onRefresh}
          additionalClasses="outlinebtn"
          leadingIcon={<RefreshCw className="w-4 h-4" />}
          text="Refresh"
        />
        <Button
          onClickHandler={onAddNew}
          additionalClasses="primarybtn"
          leadingIcon={<Plus className="w-4 h-4" />}
          text="Add Schedule"
        />
      </div>
    </div>
  );
};
