/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { QUERY_KEYS, STALE_TIME } from "../config";
import financeService from "../services/financeServices";

/**
 * Hook to search visits with filters
 */
export const useFinanceVisits = (filters = {}, options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.FINANCE_VISITS(filters),
    queryFn: () => financeService.searchVisits(filters),
    staleTime: STALE_TIME.SHORT,
    ...options,
  });
};

/**
 * Hook to get finance dashboard statistics
 */
export const useFinanceDashboard = () => {
  return useQuery({
    queryKey: QUERY_KEYS.FINANCE_DASHBOARD,
    queryFn: financeService.getDashboardStats,
    staleTime: STALE_TIME.MEDIUM,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });
};

/**
 * Hook to get visit details for finance
 */
export const useFinanceVisitDetail = (visitId: string) => {
  return useQuery({
    queryKey: QUERY_KEYS.VISIT_DETAIL_FINANCE(visitId),
    queryFn: () => financeService.getVisitDetails(visitId),
    enabled: !!visitId,
    staleTime: STALE_TIME.SHORT,
  });
};

/**
 * Hook to update payment status
 */
export const useUpdatePaymentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<
    any,
    unknown,
    {
      visitId: string;
      paymentStatus: "pending" | "partial" | "paid";
    },
    { previousVisit?: any }
  >({
    mutationFn: ({ visitId, paymentStatus }) =>
      financeService.updatePaymentStatus(visitId, paymentStatus),

    // Optimistic update
    onMutate: async ({ visitId, paymentStatus }) => {
      // Cancel queries
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.VISIT_DETAIL_FINANCE(visitId),
      });

      // Snapshot previous value
      const previousVisit = queryClient.getQueryData(
        QUERY_KEYS.VISIT_DETAIL_FINANCE(visitId)
      );

      // Optimistically update
      queryClient.setQueryData(
        QUERY_KEYS.VISIT_DETAIL_FINANCE(visitId),
        (old: any) => (old ? { ...old, paymentStatus } : old)
      );

      return { previousVisit };
    },

    onSuccess: (data, { visitId }) => {
      // Update with real data
      queryClient.setQueryData(
        QUERY_KEYS.VISIT_DETAIL_FINANCE(visitId),
        data.visit
      );

      // Invalidate related queries
      queryClient.invalidateQueries({
        queryKey: ["financeVisits"], // Invalidate all finance visits queries
      });
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.FINANCE_DASHBOARD,
      });

      toast.success("Payment status updated successfully!");
    },

    onError: (error, { visitId }, context) => {
      // Rollback on error
      if (context?.previousVisit) {
        queryClient.setQueryData(
          QUERY_KEYS.VISIT_DETAIL_FINANCE(visitId),
          context?.previousVisit
        );
      }
      console.error("Update payment status error:", error);
    },
  });
};

/**
 * Hook to export visits
 */
export const useExportVisits = () => {
  return useMutation({
    mutationFn: financeService.exportVisits,
    onSuccess: (data) => {
      // Convert to CSV and download
      const csv = convertToCSV(data);
      downloadCSV(csv, "visits-export.csv");

      toast.success("Data exported successfully!");
    },
    onError: (error) => {
      console.error("Export error:", error);
    },
  });
};

// Helper function to convert data to CSV
const convertToCSV = (data: any) => {
  if (!data || data.length === 0) return "";

  const headers = Object.keys(data[0]).join(",");
  const rows = data.map((row: any) =>
    Object.values(row)
      .map((val) =>
        typeof val === "string" && val.includes(",") ? `"${val}"` : val
      )
      .join(",")
  );

  return [headers, ...rows].join("\n");
};

// Helper function to download CSV
const downloadCSV = (csv: any, filename: string) => {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
