import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Calendar, LogOut } from "lucide-react";
import {
  useAuth,
  useCompleteVisit,
  useMyVisits,
  useStartVisit,
  useUpdateVisit,
  useAddTreatment,
  useDeleteTreatment,
  useUpdateTreatment,
} from "../../hooks";
import {
  treatmentSchema,
  updateVisitSchema,
  type TreatmentSchema,
  type TUpdateVisitSchema,
} from "../../utils";
import { DashboardLayout } from "../DashboardLayout";
import { LoadingSpinner } from "../LoadingSpinner";
import { ErrorMessage } from "../ErrorMessage";
import type { Treatment, Visit } from "../../types";
import { VisitListItem } from "../VisitListItem";
import { VisitDetailPanel } from "../visitDetailPanel";
import { TreatmentModal } from "../TreatmentModal";

export default function DoctorDashboard() {
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [showTreatmentModal, setShowTreatmentModal] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState<Treatment | null>(
    null
  );

  const { logout } = useAuth();
  const { data: visits, isLoading, error } = useMyVisits();
  const startVisit = useStartVisit();
  const updateVisit = useUpdateVisit();
  const completeVisit = useCompleteVisit();
  const addTreatment = useAddTreatment();
  const updateTreatmentMutation = useUpdateTreatment();
  const deleteTreatment = useDeleteTreatment();

  const {
    register: registerVisit,
    handleSubmit: handleSubmitVisit,
    formState: { errors: visitErrors },
  } = useForm({
    resolver: zodResolver(updateVisitSchema),
  });

  const {
    register: registerTreatment,
    handleSubmit: handleSubmitTreatment,
    reset: resetTreatment,
    setValue,
    formState: { errors: treatmentErrors },
  } = useForm({
    resolver: zodResolver(treatmentSchema),
    defaultValues: {
      category: "consultation",
    },
  });

  const handleStartVisit = (visitId: string) => {
    startVisit.mutate(visitId);
  };

  const handleVisitUpdate = (data: TUpdateVisitSchema) => {
    if (selectedVisit) {
      updateVisit.mutate(
        { visitId: selectedVisit?._id, data },
        {
          onSuccess: () => {
            // Refresh selected visit (handle nullable previous state)
            setSelectedVisit((prev: Visit | null) =>
              prev ? { ...prev, ...data } : prev
            );
          },
        }
      );
    }
  };

  const handleCompleteVisit = () => {
    if (
      selectedVisit &&
      confirm("Are you sure you want to complete this visit?")
    ) {
      completeVisit.mutate(selectedVisit?._id, {
        onSuccess: () => {
          setSelectedVisit(null);
        },
      });
    }
  };

  const handleAddTreatment = (data: TreatmentSchema) => {
    if (selectedVisit) {
      addTreatment.mutate(
        {
          visitId: selectedVisit._id,
          treatmentData: {
            ...data,
            quantity: data?.quantity,
            unitPrice: data?.unitPrice,
          },
        },
        {
          onSuccess: () => {
            setShowTreatmentModal(false);
            resetTreatment();
          },
        }
      );
    }
  };

  const handleEditTreatment = (treatment: TreatmentSchema) => {
    setEditingTreatment(treatment as Treatment);
    setValue("name", treatment.name);
    setValue("description", treatment.description || "");
    setValue("quantity", treatment.quantity);
    setValue("unitPrice", treatment.unitPrice);
    setValue("category", treatment.category);
    setShowTreatmentModal(true);
  };

  const handleUpdateTreatment = (data: TreatmentSchema) => {
    if (selectedVisit && editingTreatment) {
      updateTreatmentMutation.mutate(
        {
          visitId: selectedVisit._id,
          treatmentId: editingTreatment._id,
          data: {
            ...data,
            quantity: data?.quantity,
            unitPrice: data.unitPrice,
          },
        },
        {
          onSuccess: () => {
            setShowTreatmentModal(false);
            setEditingTreatment(null);
            resetTreatment();
          },
        }
      );
    }
  };

  const handleDeleteTreatment = (treatmentId: string) => {
    if (
      selectedVisit &&
      confirm("Are you sure you want to delete this treatment?")
    ) {
      deleteTreatment.mutate({
        visitId: selectedVisit._id,
        treatmentId,
      });
    }
  };

  const openTreatmentModal = () => {
    setEditingTreatment(null);
    resetTreatment();
    setShowTreatmentModal(true);
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Doctor Dashboard">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="large" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout title="Doctor Dashboard">
        <ErrorMessage message="Failed to load visits. Please try again." />
      </DashboardLayout>
    );
  }

  const activeVisits =
    visits?.filter(
      (v: Visit) => v.status === "scheduled" || v.status === "in_progress"
    ) || [];
  const completedVisits =
    visits?.filter((v: Visit) => v.status === "completed") || [];

  return (
    <DashboardLayout title="Doctor Dashboard">
      <div className="grid grid-cols-1 gap-6">
        {/* Left Panel - Visits List */}
        <div className="lg:col-span-1 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">My Visits</h2>
            <button onClick={logout} className="btn btn-secondary text-sm">
              <LogOut className="w-4 h-4 mr-1" />
              Logout
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="card bg-blue-50 border border-blue-200">
              <p className="text-xs text-blue-600 font-medium">Active</p>
              <p className="text-2xl font-bold text-blue-900">
                {activeVisits.length}
              </p>
            </div>
            <div className="card bg-green-50 border border-green-200">
              <p className="text-xs text-green-600 font-medium">Completed</p>
              <p className="text-2xl font-bold text-green-900">
                {completedVisits.length}
              </p>
            </div>
          </div>

          {/* Active Visits */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">
              Active Visits
            </h3>
            <div className="space-y-2">
              {activeVisits.length > 0 ? (
                activeVisits.map((visit: Visit) => (
                  <VisitListItem
                    key={visit._id}
                    visit={visit}
                    isSelected={selectedVisit?._id === visit._id}
                    onClick={() => setSelectedVisit(visit)}
                    onStart={() => handleStartVisit(visit._id)}
                    isStarting={startVisit.isPending}
                  />
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-4">
                  No active visits
                </p>
              )}
            </div>
          </div>

          {/* Completed Visits */}
          {completedVisits.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                Completed Today
              </h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {completedVisits.slice(0, 5).map((visit: Visit) => (
                  <VisitListItem
                    key={visit._id}
                    visit={visit}
                    isSelected={selectedVisit?._id === visit._id}
                    onClick={() => setSelectedVisit(visit)}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Visit Details */}
        <div className="lg:col-span-2">
          {selectedVisit ? (
            <VisitDetailPanel
              visit={selectedVisit}
              onUpdate={handleVisitUpdate}
              onComplete={handleCompleteVisit}
              onAddTreatment={openTreatmentModal}
              onEditTreatment={handleEditTreatment}
              onDeleteTreatment={handleDeleteTreatment}
              isUpdating={updateVisit.isPending}
              isCompleting={completeVisit.isPending}
              isDeleting={deleteTreatment.isPending}
              registerVisit={registerVisit}
              handleSubmitVisit={handleSubmitVisit}
              visitErrors={visitErrors}
            />
          ) : (
            <div className="card h-full flex items-center justify-center text-center">
              <div>
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Select a visit
                </h3>
                <p className="text-gray-600">
                  Choose a visit from the list to view details
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Treatment Modal */}
      {showTreatmentModal && (
        <TreatmentModal
          isOpen={showTreatmentModal}
          onClose={() => {
            setShowTreatmentModal(false);
            setEditingTreatment(null);
            resetTreatment();
          }}
          onSubmit={
            editingTreatment ? handleUpdateTreatment : handleAddTreatment
          }
          register={registerTreatment}
          handleSubmit={handleSubmitTreatment}
          errors={treatmentErrors}
          isSubmitting={
            addTreatment.isPending || updateTreatmentMutation.isPending
          }
          isEditing={!!editingTreatment}
        />
      )}
    </DashboardLayout>
  );
}
