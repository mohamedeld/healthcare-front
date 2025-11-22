/* eslint-disable @typescript-eslint/no-explicit-any */
import { CheckCircle, Edit, Loader2, Plus, Trash2 } from "lucide-react";
import { formatCurrency, formatDate, formatStatus } from "../config";
import type { Treatment, Visit } from "../types";
import type { TreatmentSchema } from "../utils";

interface IProps {
  visit: Visit;
  onUpdate: (updatedVisit: Visit) => void;
  onComplete: () => void;
  onAddTreatment: any;
  onEditTreatment: (treatment: TreatmentSchema) => void;
  isUpdating: boolean;
  isCompleting: boolean;
  isDeleting: boolean;
  onDeleteTreatment: (treatmentId: string) => void;
  registerVisit: any;
  handleSubmitVisit: any;
  visitErrors: any;
}
export function VisitDetailPanel({
  visit,
  onUpdate,
  onComplete,
  onAddTreatment,
  onEditTreatment,
  onDeleteTreatment,
  isUpdating,
  isCompleting,
  isDeleting,
  registerVisit,
  handleSubmitVisit,
  visitErrors,
}: IProps) {
  const status = formatStatus(visit.status);
  const canEdit = visit.status !== "completed" && visit.status !== "cancelled";
  const canComplete = visit.status === "in_progress";

  return (
    <div className="card h-full overflow-y-auto">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {visit.patient?.name}
          </h2>
          <p className="text-gray-600">{visit.patientId?.email}</p>
          <p className="text-sm text-gray-500 mt-1">
            {formatDate(visit.scheduledDate, "MMMM dd, yyyy hh:mm a")}
          </p>
        </div>
        <span className={`badge ${status.className}`}>{status.label}</span>
      </div>

      {/* Medical Information Form */}
      <form onSubmit={handleSubmitVisit(onUpdate)} className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Chief Complaint
          </label>
          <textarea
            {...registerVisit("chiefComplaint")}
            rows="2"
            defaultValue={visit.chiefComplaint}
            className="input w-full"
            placeholder="Patient's main concern..."
            disabled={!canEdit}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Diagnosis
          </label>
          <textarea
            {...registerVisit("diagnosis")}
            rows="3"
            defaultValue={visit.diagnosis}
            className="input w-full"
            placeholder="Medical diagnosis..."
            disabled={!canEdit}
          />
          {visitErrors.diagnosis && (
            <p className="mt-1 text-sm text-red-600">
              {visitErrors.diagnosis.message}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Clinical Notes
          </label>
          <textarea
            {...registerVisit("notes")}
            rows="4"
            defaultValue={visit.notes}
            className="input w-full"
            placeholder="Treatment plan, observations, recommendations..."
            disabled={!canEdit}
          />
          {visitErrors.notes && (
            <p className="mt-1 text-sm text-red-600">
              {visitErrors.notes.message}
            </p>
          )}
        </div>

        {canEdit && (
          <button
            type="submit"
            disabled={isUpdating}
            className="btn btn-primary w-full"
          >
            {isUpdating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Visit"
            )}
          </button>
        )}
      </form>

      {/* Treatments Section */}
      <div className="border-t pt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Treatments</h3>
          {canEdit && (
            <button
              onClick={onAddTreatment}
              className="btn btn-primary text-sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Treatment
            </button>
          )}
        </div>

        {visit.treatments && visit.treatments.length > 0 ? (
          <div className="space-y-3">
            {visit.treatments?.map((treatment: Treatment) => (
              <div key={treatment._id} className="bg-gray-50 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {treatment.name}
                    </h4>
                    {treatment.description && (
                      <p className="text-sm text-gray-600 mt-1">
                        {treatment.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                      <span>Qty: {treatment.quantity}</span>
                      <span>Unit: {formatCurrency(treatment.unitPrice)}</span>
                      <span className="font-medium text-gray-900">
                        Total: {formatCurrency(treatment.totalPrice)}
                      </span>
                    </div>
                  </div>
                  {canEdit && (
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() =>
                          onEditTreatment(treatment as TreatmentSchema)
                        }
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteTreatment(treatment._id)}
                        disabled={isDeleting}
                        className="text-red-600 hover:text-red-700"
                      >
                        {isDeleting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Total Amount */}
            <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-200">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">
                  Total Amount:
                </span>
                <span className="text-2xl font-bold text-blue-900">
                  {formatCurrency(Number(visit?.totalAmount))}
                </span>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">
            No treatments added yet
          </p>
        )}
      </div>

      {/* Complete Visit Button */}
      {canComplete && (
        <div className="mt-6 pt-6 border-t">
          <button
            onClick={onComplete}
            disabled={isCompleting}
            className="btn btn-success w-full"
          >
            {isCompleting ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Completing...
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                Complete Visit
              </>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
