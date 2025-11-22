import React from "react";
import { AlertCircle } from "lucide-react";

interface IProps {
  message: string;
  onRetry?: () => void;
}
export function ErrorMessage({ message, onRetry }: IProps) {
  return (
    <div className="card bg-red-50 border border-red-200">
      <div className="flex items-start">
        <AlertCircle className="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="text-red-900 font-semibold mb-1">Error</h3>
          <p className="text-red-700 text-sm">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-3 text-sm text-red-600 hover:text-red-700 font-medium"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
