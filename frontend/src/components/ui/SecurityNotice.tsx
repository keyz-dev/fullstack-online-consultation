import React, { useState } from "react";
import { Shield, ChevronDown, ChevronUp } from "lucide-react";

interface SecurityNoticeProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: () => void;
}

export default function SecurityNotice({
  icon,
  title,
  description,
  action,
}: SecurityNoticeProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const defaultIcon = <Shield className="text-accent" size={24} />;

  const toggleExpanded = () => {
    if (action) action();
    else setIsExpanded(!isExpanded);
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-sm overflow-hidden">
      {/* Clickable Header */}
      <div
        className="p-4 cursor-pointer hover:bg-blue-100 transition-colors duration-200"
        onClick={toggleExpanded}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">{icon || defaultIcon}</div>
            <h4 className="font-normal text-accent">{title}</h4>
          </div>
          <div className="flex-shrink-0 ml-4">
            {isExpanded ? (
              <ChevronUp className="text-accent" size={20} />
            ) : (
              <ChevronDown className="text-accent" size={20} />
            )}
          </div>
        </div>
      </div>

      {/* Expandable Content */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="p-4">
          <div className="ml-5">
            <p className="text-accent text-sm leading-relaxed">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
