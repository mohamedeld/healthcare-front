import { Calendar, Loader2, User, X } from "lucide-react";
import { formatCurrency, formatStatus } from "../config";
import type { Visit } from "../types";
import { formatDate } from "date-fns";

interface IProps {
  visit: Visit;
  onCancel?: (id: string) => void;
  isCancelling?: boolean;
}
export function VisitCard({ visit, onCancel, isCancelling }: IProps) {
  const status = formatStatus(visit.status);
  const canCancel = visit.status === "scheduled";

  return (
    <div className="card hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-start space-x-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              {visit.doctor?.name}
            </h3>
            <p className="text-sm text-gray-600">
              {visit.doctor?.specialization}
            </p>
          </div>
        </div>
        <span className={`badge ${status.className}`}>{status.label}</span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center text-gray-600">
          <Calendar className="w-4 h-4 mr-2" />
          {formatDate(visit.scheduledDate, "MMM dd, yyyy hh:mm a")}
        </div>
        {/* {visit.chiefComplaint && (
          <div className="flex items-start text-gray-600">
            <FileText className="w-4 h-4 mr-2 mt-0.5" />
            <span>{visit.chiefComplaint}</span>
          </div>
        )} */}
        {visit.status === "completed" && (
          <>
            {visit?.diagnosis && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <p className="text-xs text-blue-600 font-medium mb-1">
                  Diagnosis
                </p>
                <p className="text-sm text-gray-800">{visit.diagnosis}</p>
              </div>
            )}
            <div className="flex items-center justify-between pt-3 border-t">
              <span className="text-gray-600 font-medium">Total Amount:</span>
              <span className="text-xl font-bold text-gray-900">
                {formatCurrency(Number(visit.totalAmount))}
              </span>
            </div>
          </>
        )}
      </div>

      {canCancel && onCancel && (
        <div className="mt-4 pt-4 border-t">
          <button
            onClick={() => onCancel(visit?._id)}
            disabled={isCancelling}
            className="btn btn-danger w-full flex items-center justify-center"
          >
            {isCancelling ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Cancelling...
              </>
            ) : (
              <>
                <X className="w-4 h-4 mr-2" />
                Cancel Visit
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
