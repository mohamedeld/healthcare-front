import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Calendar,
  Plus,
  X,
  Loader2,
  Clock,
  FileText,
  LogOut,
} from "lucide-react";
import {
  useAuth,
  useCancelVisit,
  useCreateVisit,
  useDoctors,
  useMyVisits,
} from "../../hooks";
import { createVisitSchema, type TCreateVisitSchema } from "../../utils";
import { DashboardLayout } from "../DashboardLayout";
import { LoadingSpinner } from "../LoadingSpinner";
import { ErrorMessage } from "../ErrorMessage";
import type { IDoctor, Visit } from "../../types";
import { VisitCard } from "../VisitCard";
import { ConfirmModal } from "../ConfirmModal";

export function PatientDashboard() {
  const [showCreateModal, setShowCreateModal] = useState(false);

  const [visitToCancel, setVisitToCancel] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { logout } = useAuth();
  const {
    data: visits,
    isLoading: visitsLoading,
    error: visitsError,
  } = useMyVisits();
  const { data: doctors, isLoading: doctorsLoading } = useDoctors();
  const createVisit = useCreateVisit();
  const cancelVisit = useCancelVisit();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createVisitSchema),
  });

  const onSubmit = (data: TCreateVisitSchema) => {
    createVisit.mutate(data, {
      onSuccess: () => {
        setShowCreateModal(false);
        reset();
      },
    });
  };

  const handleCancelVisit = (visitId: string) => {
    setVisitToCancel(visitId);
    setIsConfirmOpen(true);
  };

  if (visitToCancel && isConfirmOpen) {
    return (
      <ConfirmModal
        isOpen={isConfirmOpen}
        message="Are you sure you want to delete this treatment?"
        onCancel={() => setIsConfirmOpen(false)}
        onConfirm={() => {
          if (visitToCancel && isConfirmOpen) {
            cancelVisit.mutate(visitToCancel);
          }
          setIsConfirmOpen(false);
          setVisitToCancel("");
        }}
      />
    );
  }

  if (visitsLoading) {
    return (
      <DashboardLayout title="Patient Dashboard">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="large" />
        </div>
      </DashboardLayout>
    );
  }

  if (visitsError) {
    return (
      <DashboardLayout title="Patient Dashboard">
        <ErrorMessage message="Failed to load visits. Please try again." />
      </DashboardLayout>
    );
  }

  const scheduledVisits =
    visits?.filter(
      (v: Visit) => v.status === "scheduled" || v.status === "in_progress"
    ) || [];
  const completedVisits =
    visits?.filter((v: Visit) => v.status === "completed") || [];

  return (
    <DashboardLayout title="Patient Dashboard">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Visits</h1>
            <p className="text-gray-600 mt-1">
              Manage your healthcare appointments
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Schedule Visit
            </button>
            <button
              onClick={logout}
              className="btn btn-secondary flex items-center"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Logout
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-medium">
                  Total Visits
                </p>
                <p className="text-3xl font-bold text-blue-900 mt-1">
                  {visits?.length || 0}
                </p>
              </div>
              <Calendar className="w-12 h-12 text-blue-500 opacity-50" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-medium">Completed</p>
                <p className="text-3xl font-bold text-green-900 mt-1">
                  {completedVisits.length}
                </p>
              </div>
              <FileText className="w-12 h-12 text-green-500 opacity-50" />
            </div>
          </div>

          <div className="card bg-gradient-to-br from-yellow-50 to-yellow-100 border border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600 font-medium">Upcoming</p>
                <p className="text-3xl font-bold text-yellow-900 mt-1">
                  {scheduledVisits.length}
                </p>
              </div>
              <Clock className="w-12 h-12 text-yellow-500 opacity-50" />
            </div>
          </div>
        </div>

        {/* Upcoming Visits */}
        {scheduledVisits.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Upcoming Visits
            </h2>
            <div className="grid gap-4">
              {scheduledVisits?.map((visit: Visit) => (
                <VisitCard
                  key={visit?._id}
                  visit={visit}
                  onCancel={handleCancelVisit}
                  isCancelling={cancelVisit.isPending}
                />
              ))}
            </div>
          </div>
        )}

        {/* Completed Visits */}
        {completedVisits.length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Visit History
            </h2>
            <div className="grid gap-4">
              {completedVisits?.map((visit: Visit) => (
                <VisitCard key={visit._id} visit={visit} />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {visits?.length === 0 && (
          <div className="card text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No visits yet
            </h3>
            <p className="text-gray-600 mb-4">
              Schedule your first visit with a doctor
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary inline-flex items-center"
            >
              <Plus className="w-5 h-5 mr-2" />
              Schedule Visit
            </button>
          </div>
        )}
      </div>

      {/* Create Visit Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Schedule Visit
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Select Doctor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Doctor *
                </label>
                <select
                  {...register("doctorId")}
                  className={`input ${errors.doctorId ? "border-red-500" : ""}`}
                  disabled={createVisit.isPending || doctorsLoading}
                >
                  <option value="">Choose a doctor...</option>
                  {doctors?.map((doctor: IDoctor) => (
                    <option key={doctor?._id} value={doctor._id}>
                      {doctor.name} - {doctor.specialization}
                    </option>
                  ))}
                </select>
                {errors.doctorId && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.doctorId.message}
                  </p>
                )}
              </div>

              {/* Scheduled Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Appointment Date & Time *
                </label>
                <input
                  {...register("scheduledDate")}
                  type="datetime-local"
                  className={`input ${
                    errors.scheduledDate ? "border-red-500" : ""
                  }`}
                  disabled={createVisit.isPending}
                  min={new Date().toISOString().slice(0, 16)}
                />
                {errors.scheduledDate && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.scheduledDate.message}
                  </p>
                )}
              </div>

              {/* Chief Complaint */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Reason for Visit
                </label>
                <textarea
                  {...register("chiefComplaint")}
                  rows={3}
                  className={`input w-full ${
                    errors.chiefComplaint ? "border-red-500" : ""
                  }`}
                  placeholder="Describe your symptoms or reason for visit..."
                  disabled={createVisit.isPending}
                />
                {errors.chiefComplaint && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.chiefComplaint.message}
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="btn btn-secondary flex-1"
                  disabled={createVisit.isPending}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createVisit.isPending}
                  className="btn btn-primary flex-1 flex items-center justify-center"
                >
                  {createVisit.isPending ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Scheduling...
                    </>
                  ) : (
                    "Schedule Visit"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
