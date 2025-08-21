import React from "react";

interface FormHeaderProps {
  title: string;
  description: string;
}

export default function FormHeader({ title, description }: FormHeaderProps) {
  return (
    <div className="text-center mb-4">
      <h1 className="text-2xl font-bold text-primary mb-2">{title}</h1>
      <p className="text-placeholder text-sm">{description}</p>
    </div>
  );
}
