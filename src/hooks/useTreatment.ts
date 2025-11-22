/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import visitService from "../services/visitServices";
import { QUERY_KEYS } from "../config";
import type { TreatmentDTO, Visit } from "../types";

/**
 * Hook to add treatment to visit
 */
export const useAddTreatment = () => {
  const queryClient = useQueryClient();

  return useMutation<
    any,
    unknown,
    {
      visitId: string;
      treatmentData: TreatmentDTO;
    }
  >({
    mutationFn: ({ visitId, treatmentData }) =>
      visitService.addTreatment(visitId, treatmentData),

    // Optimistic update
    onMutate: async ({ visitId, treatmentData }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.VISIT_DETAIL(visitId),
      });

      // Snapshot previous value
      const previousVisit = queryClient.getQueryData(
        QUERY_KEYS.VISIT_DETAIL(visitId)
      );

      // Optimistically update to the new value
      queryClient.setQueryData(
        QUERY_KEYS.VISIT_DETAIL(visitId),
        (old: Visit) => {
          if (!old) return old;

          const newTreatment = {
            ...treatmentData,
            _id: `temp-${Date.now()}`,
            totalPrice:
              treatmentData?.unitPrice * (treatmentData.quantity || 1),
          };

          return {
            ...old,
            treatments: [...(old?.treatments || []), newTreatment],
            totalAmount: (
              parseFloat(old?.totalAmount) + newTreatment.totalPrice
            ).toFixed(2),
          };
        }
      );

      return { previousVisit };
    },

    onSuccess: (data, { visitId }) => {
      // Replace with real data from server
      queryClient.setQueryData(QUERY_KEYS.VISIT_DETAIL(visitId), data.visit);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_VISITS });

      toast.success("Treatment added successfully!");
    },

    onError: (error, { visitId }, context) => {
      // Rollback on error
      if (context?.previousVisit) {
        queryClient.setQueryData(
          QUERY_KEYS.VISIT_DETAIL(visitId),
          context.previousVisit
        );
      }
      console.error("Add treatment error:", error);
    },
  });
};

/**
 * Hook to update treatment
 */
export const useUpdateTreatment = () => {
  const queryClient = useQueryClient();

  return useMutation<
    any,
    unknown,
    {
      visitId: string;
      treatmentId: string;
      data: TreatmentDTO;
    }
  >({
    mutationFn: ({ visitId, treatmentId, data }) =>
      visitService.updateTreatment(visitId, treatmentId, data),

    onMutate: async ({ visitId, treatmentId, data }) => {
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.VISIT_DETAIL(visitId),
      });

      const previousVisit = queryClient.getQueryData(
        QUERY_KEYS.VISIT_DETAIL(visitId)
      );

      queryClient.setQueryData(
        QUERY_KEYS.VISIT_DETAIL(visitId),
        (old: Visit) => {
          if (!old) return old;

          const updatedTreatments = old.treatments.map((t) => {
            if (t._id === treatmentId) {
              const updated = { ...t, ...data };
              updated.totalPrice = (
                updated.unitPrice * updated.quantity
              ).toFixed(2);
              return updated;
            }
            return t;
          });

          const totalAmount = updatedTreatments
            .reduce((sum, t) => sum + parseFloat(t.totalPrice), 0)
            .toFixed(2);

          return {
            ...old,
            treatments: updatedTreatments,
            totalAmount,
          };
        }
      );

      return { previousVisit };
    },

    onSuccess: (data, { visitId }) => {
      queryClient.setQueryData(QUERY_KEYS.VISIT_DETAIL(visitId), data.visit);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_VISITS });

      toast.success("Treatment updated successfully!");
    },

    onError: (error, { visitId }, context) => {
      if (context?.previousVisit) {
        queryClient.setQueryData(
          QUERY_KEYS.VISIT_DETAIL(visitId),
          context.previousVisit
        );
      }
      console.error("Update treatment error:", error);
    },
  });
};

/**
 * Hook to delete treatment
 */
export const useDeleteTreatment = () => {
  const queryClient = useQueryClient();

  return useMutation<
    any,
    unknown,
    {
      visitId: string;
      treatmentId: string;
    }
  >({
    mutationFn: ({ visitId, treatmentId }) =>
      visitService.deleteTreatment(visitId, treatmentId),

    onMutate: async ({ visitId, treatmentId }) => {
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.VISIT_DETAIL(visitId),
      });

      const previousVisit = queryClient.getQueryData(
        QUERY_KEYS.VISIT_DETAIL(visitId)
      );

      queryClient.setQueryData(
        QUERY_KEYS.VISIT_DETAIL(visitId),
        (old: Visit) => {
          if (!old) return old;

          const updatedTreatments = old?.treatments?.filter(
            (t) => t._id !== treatmentId
          );

          const totalAmount = updatedTreatments
            ?.reduce((sum, t) => sum + parseFloat(t.totalPrice ?? 0), 0)
            .toFixed(2);

          return {
            ...old,
            treatments: updatedTreatments,
            totalAmount,
          };
        }
      );

      return { previousVisit };
    },

    onSuccess: (data, { visitId }) => {
      queryClient.setQueryData(QUERY_KEYS.VISIT_DETAIL(visitId), data.visit);
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.MY_VISITS });

      toast.success("Treatment deleted successfully!");
    },

    onError: (error, { visitId }, context) => {
      if (context?.previousVisit) {
        queryClient.setQueryData(
          QUERY_KEYS.VISIT_DETAIL(visitId),
          context.previousVisit
        );
      }
      console.error("Delete treatment error:", error);
    },
  });
};
