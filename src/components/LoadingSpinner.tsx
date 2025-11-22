import React from "react";
import { Loader2 } from "lucide-react";

interface IProps {
  size: "small" | "medium" | "large";
  text?: string;
}
export function LoadingSpinner({ size = "medium", text }: IProps) {
  const sizes = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  };

  return (
    <div className="flex flex-col items-center justify-center">
      <Loader2 className={`${sizes[size]} animate-spin text-blue-600`} />
      {text && <p className="mt-2 text-sm text-gray-600">{text}</p>}
    </div>
  );
}
