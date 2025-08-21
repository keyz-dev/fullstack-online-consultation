import React from "react";
import Image from "next/image";

interface LogoProps {
  size?: number;
  destination?: string;
}

export default function Logo({ size = 90, destination = "/" }: LogoProps) {
  return (
    <a href={destination} className="grid place-items-center h-full">
      <Image
        src="/logo.png"
        alt="Logo"
        width={size}
        height={size}
        className="object-center object-contain inline-block"
      />
    </a>
  );
}
