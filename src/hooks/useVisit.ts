import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import visitService from "../services/visitServices";
import { QUERY_KEYS, STALE_TIME } from "../config";
import type { Visit } from "../types";

/**
 * Hook to get user's visits
 */
export const useMyVisits = () => {
  return useQuery({
    queryKey: QUERY_KEYS.MY_VISITS,
    queryFn: visitService.getMyVisits,
    staleTime: STALE_TIME.SHORT,
    refetchOnWindowFocus: true,
  });
};

/**
 * Hook to get visit by ID
 */
export const useVisit = (visitId: string, options = {}) => {
  return useQuery({
    queryKey: QUERY_KEYS.VISIT_DETAIL(visitId),
    queryFn: () => visitService.getVisitById(visitId),
    enabled: !!visitId,
    staleTime: STALE_TIME.SHORT,
    ...options,
  });
};

/**
 * Hook to create a new visit
 */
export const useCreateVisit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: visitService.createVisit,
    onSuccess: (data) => {
      // Invalidate visits list to refetch
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_VISITS });

      // Optimistically update the cache
      queryClient.setQueryData(QUERY_KEYS.MY_VISITS, (old: Visit[]) =>
        old ? [data.visit, ...old] : [data.visit]
      );

      toast.success("Visit scheduled successfully!");
    },
    onError: (error) => {
      console.error("Create visit error:", error);
    },
  });
};

/**
 * Hook to start a visit
 */
export const useStartVisit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: visitService.startVisit,
    onSuccess: (data, visitId) => {
      // Update the specific visit cache
      queryClient.setQueryData(QUERY_KEYS.VISIT_DETAIL(visitId), data.visit);

      // Invalidate visits list
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_VISITS });

      toast.success("Visit started successfully!");
    },
    onError: (error) => {
      console.error("Start visit error:", error);
    },
  });
};

/**
 * Hook to update visit
 */
export const useUpdateVisit = () => {
  const queryClient = useQueryClient();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return useMutation<any, unknown, { visitId: string; data: Partial<Visit> }>({
    mutationFn: ({
      visitId,
      data,
    }: {
      visitId: string;
      data: Partial<Visit>;
    }) => visitService.updateVisit(visitId, data),
    onSuccess: (data, { visitId }) => {
      // Update cache
      queryClient.setQueryData(QUERY_KEYS.VISIT_DETAIL(visitId), data.visit);

      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_VISITS });

      toast.success("Visit updated successfully!");
    },
    onError: (error) => {
      console.error("Update visit error:", error);
    },
  });
};

/**
 * Hook to complete a visit
 */
export const useCompleteVisit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: visitService.completeVisit,
    onSuccess: (data, visitId) => {
      queryClient.setQueryData(QUERY_KEYS.VISIT_DETAIL(visitId), data.visit);

      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_VISITS });

      toast.success("Visit completed successfully!");
    },
    onError: (error) => {
      console.error("Complete visit error:", error);
    },
  });
};

/**
 * Hook to cancel a visit
 */
export const useCancelVisit = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: visitService.cancelVisit,
    onSuccess: (data, visitId) => {
      queryClient.setQueryData(QUERY_KEYS.VISIT_DETAIL(visitId), data.visit);

      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_VISITS });

      toast.success("Visit cancelled successfully!");
    },
    onError: (error) => {
      console.error("Cancel visit error:", error);
    },
  });
};
