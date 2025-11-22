import { User, Play, Loader2 } from "lucide-react";
import { formatDate, formatStatus } from "../config";
import type { Visit } from "../types";

interface IProps {
  visit: Visit;
  onClick: () => void;
  onStart?: () => void;
  isSelected: boolean;
  isStarting?: boolean;
}
export function VisitListItem({
  visit,
  isSelected,
  onClick,
  onStart,
  isStarting,
}: IProps) {
  const status = formatStatus(visit.status);
  const canStart = visit.status === "scheduled";

  return (
    <div
      onClick={onClick}
      className={`card cursor-pointer transition-all ${
        isSelected ? "ring-2 ring-blue-500 bg-blue-50" : "hover:shadow-md"
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center space-x-2">
          <User className="w-4 h-4 text-gray-600" />
          <span className="font-medium text-sm text-gray-900">
            {visit.patient?.name}
          </span>
        </div>
        <span className={`badge text-xs ${status.className}`}>
          {status.label}
        </span>
      </div>
      <p className="text-xs text-gray-600 mb-2">
        {formatDate(visit.scheduledDate, "MMM dd, hh:mm a")}
      </p>
      {canStart && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onStart) onStart();
          }}
          disabled={isStarting}
          className="btn btn-primary w-full text-xs py-1 mt-2"
        >
          {isStarting ? (
            <Loader2 className="w-3 h-3 animate-spin mx-auto" />
          ) : (
            <>
              <Play className="w-3 h-3 mr-1" />
              Start Visit
            </>
          )}
        </button>
      )}
    </div>
  );
}
