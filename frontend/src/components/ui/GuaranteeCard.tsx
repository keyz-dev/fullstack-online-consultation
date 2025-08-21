import React from "react";
import Image from "next/image";

interface GuaranteeItem {
  imageUrl: string;
  title: string;
  description: string;
}

interface GuaranteeCardProps {
  item: GuaranteeItem;
}

export default function GuaranteeCard({ item }: GuaranteeCardProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-6">
      <div>
        <Image
          src={item.imageUrl}
          alt={`${item.title} icon`}
          width={64}
          height={64}
          className="w-16 h-16"
        />
      </div>
      <span className="text-lg font-semibold dark:text-light_bg">
        {item.title}
      </span>
      <span className="text-center text-secondary/70 w-[70%]">
        {item.description}
      </span>
    </div>
  );
}
