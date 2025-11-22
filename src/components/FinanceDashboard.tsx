/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Search,
  Filter,
  LogOut,
  X,
  TrendingUp,
  Clock,
  CheckCircle,
  Calendar,
} from "lucide-react";
import {
  useAuth,
  useFinanceDashboard,
  useFinanceVisits,
  useUpdatePaymentStatus,
} from "../hooks";
import { DashboardLayout } from "./DashboardLayout";
import { LoadingSpinner } from "./LoadingSpinner";
import { formatCurrency } from "../config";
import type { Visit } from "../types";
import { VisitRow } from "./VisitRow";
import { VisitDetailsModal } from "./VisitDetails";
import { financeSearchSchema, type TSearchSchema } from "../utils";

export default function FinanceDashboard() {
  const [filters, setFilters] = useState({});
  const [selectedVisit, setSelectedVisit] = useState<Visit | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const { logout } = useAuth();
  const { data: visitsData, isLoading: visitsLoading } =
    useFinanceVisits(filters);
  const { data: dashboard, isLoading: dashboardLoading } =
    useFinanceDashboard();
  const updatePayment = useUpdatePaymentStatus();

  const { register, handleSubmit, reset } = useForm<TSearchSchema>({
    resolver: zodResolver(financeSearchSchema),
    defaultValues: filters,
  });

  const onSearch = (data: TSearchSchema) => {
    // Remove empty values
    const cleanedFilters = Object.entries(data).reduce<Record<string, unknown>>(
      (acc, [key, value]) => {
        if (value && value !== "") {
          acc[key] = value;
        }
        return acc;
      },
      {}
    );
    setFilters(cleanedFilters);
    setShowFilters(false);
  };

  const handleClearFilters = () => {
    reset();
    setFilters({});
    setShowFilters(false);
  };

  const handleUpdatePayment = (visitId: string, status: string) => {
    (updatePayment.mutate as any)({ visitId, paymentStatus: status });
  };

  if (dashboardLoading) {
    return (
      <DashboardLayout title="Finance Dashboard">
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner size="large" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Finance Dashboard">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Finance Overview
            </h1>
            <p className="text-gray-600 mt-1">Manage visits and payments</p>
          </div>
          <button
            onClick={logout}
            className="btn btn-secondary flex items-center"
          >
            <LogOut className="w-5 h-5 mr-2" />
            Logout
          </button>
        </div>

        {/* Stats Dashboard */}
        {dashboard && (
          <div className="grid md:grid-cols-4 gap-6">
            <div className="card bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <TrendingUp className="w-8 h-8 text-blue-600" />
                <span className="text-xs text-blue-600 font-medium">TOTAL</span>
              </div>
              <p className="text-3xl font-bold text-blue-900 mb-1">
                {formatCurrency(dashboard.overall.totalRevenue)}
              </p>
              <p className="text-sm text-blue-700">Total Revenue</p>
            </div>

            <div className="card bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
              <div className="flex items-center justify-between mb-2">
                <CheckCircle className="w-8 h-8 text-green-600" />
                <span className="text-xs text-green-600 font-medium">PAID</span>
              </div>
              <p className="text-3xl font-bold text-green-900 mb-1">
                {formatCurrency(dashboard.overall.paidAmount)}
              </p>
              <p className="text-sm text-green-700">
                {dashboard.overall.collectionRate} Collection Rate
              </p>
            </div>

            <div className="card bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
              <div className="flex items-center justify-between mb-2">
                <Clock className="w-8 h-8 text-orange-600" />
                <span className="text-xs text-orange-600 font-medium">
                  PENDING
                </span>
              </div>
              <p className="text-3xl font-bold text-orange-900 mb-1">
                {formatCurrency(dashboard.overall.pendingPayments)}
              </p>
              <p className="text-sm text-orange-700">Outstanding</p>
            </div>

            <div className="card bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200">
              <div className="flex items-center justify-between mb-2">
                <Calendar className="w-8 h-8 text-purple-600" />
                <span className="text-xs text-purple-600 font-medium">
                  VISITS
                </span>
              </div>
              <p className="text-3xl font-bold text-purple-900 mb-1">
                {dashboard.overall.completedVisits}
              </p>
              <p className="text-sm text-purple-700">Completed</p>
            </div>
          </div>
        )}

        {/* Search & Filters */}
        <div className="card">
          <div className="flex gap-3 mb-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="btn btn-secondary flex items-center"
            >
              <Filter className="w-5 h-5 mr-2" />
              {showFilters ? "Hide Filters" : "Show Filters"}
              {Object.keys(filters).length > 0 && (
                <span className="ml-2 bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                  {Object.keys(filters).length}
                </span>
              )}
            </button>
            {Object.keys(filters).length > 0 && (
              <button
                onClick={handleClearFilters}
                className="btn btn-secondary flex items-center text-red-600"
              >
                <X className="w-5 h-5 mr-2" />
                Clear Filters
              </button>
            )}
          </div>

          {/* Filters Form */}
          {showFilters && (
            <form
              onSubmit={handleSubmit(onSearch)}
              className="space-y-4 p-4 bg-gray-50 rounded-lg"
            >
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Visit ID
                  </label>
                  <input
                    {...register("visitId")}
                    type="text"
                    className="input"
                    placeholder="Enter visit ID..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Doctor Name
                  </label>
                  <input
                    {...register("doctorName")}
                    type="text"
                    className="input"
                    placeholder="Search doctor..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient Name
                  </label>
                  <input
                    {...register("patientName")}
                    type="text"
                    className="input"
                    placeholder="Search patient..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Visit Status
                  </label>
                  <select {...register("status")} className="input">
                    <option value="">All Status</option>
                    <option value="scheduled">Scheduled</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Payment Status
                  </label>
                  <select {...register("paymentStatus")} className="input">
                    <option value="">All Payments</option>
                    <option value="pending">Pending</option>
                    <option value="partial">Partial</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Range
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      {...register("startDate")}
                      type="date"
                      className="input text-sm"
                    />
                    <input
                      {...register("endDate")}
                      type="date"
                      className="input text-sm"
                    />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn btn-primary w-full">
                <Search className="w-5 h-5 mr-2" />
                Search Visits
              </button>
            </form>
          )}
        </div>

        {/* Results */}
        {visitsLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" />
          </div>
        ) : visitsData && visitsData?.visits ? (
          <>
            {/* Results Header */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Search Results ({visitsData?.count})
                </h2>
                {visitsData?.statistics && (
                  <p className="text-sm text-gray-600 mt-1">
                    Total: {formatCurrency(visitsData.statistics.totalRevenue)}{" "}
                    • Pending: {visitsData.statistics.pendingPayments} visits •
                    Paid: {visitsData.statistics.paidVisits} visits
                  </p>
                )}
              </div>
            </div>

            {/* Visits Table */}
            <div className="card overflow-x-auto">
              {visitsData.visits.length > 0 ? (
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Visit ID
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Patient
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Doctor
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Amount
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Payment
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {visitsData.visits.map((visit: Visit) => (
                      <VisitRow
                        key={visit._id}
                        visit={visit}
                        onUpdatePayment={handleUpdatePayment}
                        onViewDetails={() => setSelectedVisit(visit)}
                        isUpdating={updatePayment.isPending}
                      />
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-center py-12">
                  <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No visits found
                  </h3>
                  <p className="text-gray-600">
                    Try adjusting your search criteria
                  </p>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="card text-center py-12">
            <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Start Searching
            </h3>
            <p className="text-gray-600">
              Use the filters above to search for visits
            </p>
          </div>
        )}
      </div>

      {/* Visit Details Modal */}
      {selectedVisit && (
        <VisitDetailsModal
          visit={selectedVisit}
          onClose={() => setSelectedVisit(null)}
          onUpdatePayment={handleUpdatePayment}
        />
      )}
    </DashboardLayout>
  );
}
