import React from "react";
import { Eye } from "lucide-react";
import type { Visit } from "../types";
import {
  formatCurrency,
  formatDate,
  formatPaymentStatus,
  formatStatus,
} from "../config";

interface IProps {
  visit: Visit;
  onUpdatePayment: (visitId: string, newStatus: string) => void;
  onViewDetails: () => void;
  isUpdating: boolean;
}
export function VisitRow({
  visit,
  onUpdatePayment,
  onViewDetails,
  isUpdating,
}: IProps) {
  const status = formatStatus(visit?.status);
  const paymentStatus = formatPaymentStatus(visit?.paymentStatus);

  return (
    <tr className="hover:bg-gray-50">
      <td className="px-4 py-3 text-sm">
        <span className="font-mono text-gray-600">{visit?._id?.slice(-8)}</span>
      </td>
      <td className="px-4 py-3 text-sm">
        <div>
          <p className="font-medium text-gray-900">{visit?.patient?.name}</p>
          <p className="text-gray-500 text-xs">{visit?.patient?.email}</p>
        </div>
      </td>
      <td className="px-4 py-3 text-sm">
        <div>
          <p className="font-medium text-gray-900">{visit?.doctor?.name}</p>
          <p className="text-gray-500 text-xs">
            {visit?.doctor?.specialization}
          </p>
        </div>
      </td>
      <td className="px-4 py-3 text-sm text-gray-600">
        {formatDate(visit?.scheduledDate, "MMM dd, yyyy")}
      </td>
      <td className="px-4 py-3 text-sm font-semibold text-gray-900">
        {formatCurrency(Number(visit?.totalAmount))}
      </td>
      <td className="px-4 py-3 text-sm">
        <span className={`badge ${status.className}`}>{status.label}</span>
      </td>
      <td className="px-4 py-3 text-sm">
        {visit?.status === "completed" ? (
          <select
            value={visit?.paymentStatus}
            onChange={(e) => onUpdatePayment(visit?.id, e.target.value)}
            disabled={isUpdating}
            className={`text-xs border rounded px-2 py-1 ${paymentStatus.className} cursor-pointer`}
          >
            <option value="pending">Pending</option>
            <option value="partial">Partial</option>
            <option value="paid">Paid</option>
          </select>
        ) : (
          <span className={`badge ${paymentStatus.className}`}>
            {paymentStatus.label}
          </span>
        )}
      </td>
      <td className="px-4 py-3 text-sm">
        <button
          onClick={onViewDetails}
          className="text-blue-600 hover:text-blue-700 flex items-center"
        >
          <Eye className="w-4 h-4 mr-1" />
          View
        </button>
      </td>
    </tr>
  );
}
