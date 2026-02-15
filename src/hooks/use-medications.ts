import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { medicationService } from "@/services/medication-service";
import { medicationLogService } from "@/services/medication-log-service";
import { useAuth } from "@/hooks/use-auth";
import { QUERY_KEYS, STALE_TIME } from "@/lib/constants";
import type { MedicationWithStatus, MedicationInsert } from "@/types";

export function useMedicationsWithStatus() {
  const { user } = useAuth();

  return useQuery({
    queryKey: QUERY_KEYS.MEDICATIONS_WITH_STATUS,
    queryFn: () => medicationService.getWithTodayStatus(user!.id),
    enabled: !!user,
    staleTime: STALE_TIME.MEDICATIONS,
  });
}

export function useAddMedication() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: MedicationInsert) =>
      medicationService.create(user!.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.MEDICATIONS_WITH_STATUS,
      });
    },
  });
}

export function useDeleteMedication() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => medicationService.remove(id),
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.MEDICATIONS_WITH_STATUS,
      });

      const previous = queryClient.getQueryData<MedicationWithStatus[]>(
        QUERY_KEYS.MEDICATIONS_WITH_STATUS,
      );

      queryClient.setQueryData<MedicationWithStatus[]>(
        QUERY_KEYS.MEDICATIONS_WITH_STATUS,
        (old) => old?.filter((m) => m.id !== deletedId) ?? [],
      );

      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          QUERY_KEYS.MEDICATIONS_WITH_STATUS,
          context.previous,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.MEDICATIONS_WITH_STATUS,
      });
    },
  });
}

export function useMarkAsTaken() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (medicationId: string) =>
      medicationLogService.markTaken(medicationId, user!.id),
    onMutate: async (medicationId) => {
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.MEDICATIONS_WITH_STATUS,
      });

      const previous = queryClient.getQueryData<MedicationWithStatus[]>(
        QUERY_KEYS.MEDICATIONS_WITH_STATUS,
      );

      queryClient.setQueryData<MedicationWithStatus[]>(
        QUERY_KEYS.MEDICATIONS_WITH_STATUS,
        (old) =>
          old?.map((m) =>
            m.id === medicationId
              ? { ...m, taken_today: true, taken_at: new Date().toISOString() }
              : m,
          ) ?? [],
      );

      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          QUERY_KEYS.MEDICATIONS_WITH_STATUS,
          context.previous,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.MEDICATIONS_WITH_STATUS,
      });
    },
  });
}

export function useUnmarkAsTaken() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (logId: string) => medicationLogService.unmarkTaken(logId),
    onMutate: async (logId) => {
      await queryClient.cancelQueries({
        queryKey: QUERY_KEYS.MEDICATIONS_WITH_STATUS,
      });

      const previous = queryClient.getQueryData<MedicationWithStatus[]>(
        QUERY_KEYS.MEDICATIONS_WITH_STATUS,
      );

      queryClient.setQueryData<MedicationWithStatus[]>(
        QUERY_KEYS.MEDICATIONS_WITH_STATUS,
        (old) =>
          old?.map((m) =>
            m.log_id === logId
              ? { ...m, taken_today: false, taken_at: null, log_id: null }
              : m,
          ) ?? [],
      );

      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          QUERY_KEYS.MEDICATIONS_WITH_STATUS,
          context.previous,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: QUERY_KEYS.MEDICATIONS_WITH_STATUS,
      });
    },
  });
}
