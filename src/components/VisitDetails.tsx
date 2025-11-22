import React from "react";
import { X, User, Calendar } from "lucide-react";
import {
  formatDate,
  formatCurrency,
  formatStatus,
  formatPaymentStatus,
} from "../config";
import type { Visit } from "../types";

interface IProps {
  visit: Visit;
  onClose: () => void;
  onUpdatePayment: (visitId: string, newStatus: string) => void;
}

export function VisitDetailsModal({ visit, onClose, onUpdatePayment }: IProps) {
  const status = formatStatus(visit.status);
  const paymentStatus = formatPaymentStatus(visit.paymentStatus);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Visit Details</h2>
            <p className="text-sm text-gray-600 mt-1">ID: {visit?._id}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Patient & Doctor Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <User className="w-5 h-5 text-blue-600 mr-2" />
                <h3 className="font-semibold text-gray-900">
                  Patient Information
                </h3>
              </div>
              <div className="space-y-1 text-sm">
                <p className="text-gray-900 font-medium">
                  {visit?.patient?.name}
                </p>
                <p className="text-gray-600">{visit?.patientId?.email}</p>
                {visit?.patientId?.phone && (
                  <p className="text-gray-600">{visit?.patientId?.phone}</p>
                )}
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <User className="w-5 h-5 text-green-600 mr-2" />
                <h3 className="font-semibold text-gray-900">
                  Doctor Information
                </h3>
              </div>
              <div className="space-y-1 text-sm">
                <p className="text-gray-900 font-medium">
                  {visit.doctor?.name}
                </p>
                <p className="text-gray-600">
                  {visit?.doctorId?.specialization}
                </p>
                <p className="text-gray-600">{visit?.doctorId?.email}</p>
              </div>
            </div>
          </div>

          {/* Visit Info */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3">
              Visit Information
            </h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 mb-1">Scheduled Date</p>
                <p className="text-gray-900 font-medium flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDate(visit.scheduledDate, "MMMM dd, yyyy hh:mm a")}
                </p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Visit Status</p>
                <span className={`badge ${status.className}`}>
                  {status.label}
                </span>
              </div>
            </div>
          </div>

          {visit?.diagnosis && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Diagnosis</h3>
              <p className="text-gray-700 bg-gray-50 rounded-lg p-3 text-sm">
                {visit.diagnosis}
              </p>
            </div>
          )}

          {visit.notes && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">
                Clinical Notes
              </h3>
              <p className="text-gray-700 bg-gray-50 rounded-lg p-3 text-sm">
                {visit.notes}
              </p>
            </div>
          )}

          {/* Treatments */}
          {visit.treatments && visit?.treatments?.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Treatments</h3>
              <div className="space-y-2">
                {visit?.treatments?.map((treatment, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-3">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-gray-900">
                          {treatment?.name}
                        </p>
                        {treatment.description && (
                          <p className="text-sm text-gray-600 mt-1">
                            {treatment.description}
                          </p>
                        )}
                      </div>
                      <span className="text-sm font-semibold text-gray-900">
                        {formatCurrency(treatment.totalPrice)}
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-gray-600 space-x-4">
                      <span>Qty: {treatment.quantity}</span>
                      <span>
                        Unit Price: {formatCurrency(treatment.unitPrice)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payment Summary */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border-2 border-blue-200">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-900">Payment Summary</h3>
              <span className={`badge ${paymentStatus.className}`}>
                {paymentStatus.label}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium text-gray-900">
                Total Amount:
              </span>
              <span className="text-3xl font-bold text-blue-900">
                {formatCurrency(Number(visit?.totalAmount))}
              </span>
            </div>
            {visit.status === "completed" && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Update Payment Status
                </label>
                <select
                  value={visit.paymentStatus}
                  onChange={(e) => onUpdatePayment(visit._id, e.target.value)}
                  className="input"
                >
                  <option value="pending">Pending</option>
                  <option value="partial">Partial</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="btn btn-primary">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
