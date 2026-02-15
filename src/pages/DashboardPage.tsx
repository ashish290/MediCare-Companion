import { useState, useCallback } from "react";
import { format } from "date-fns";
import { Plus, LogOut, Pill } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  useMedicationsWithStatus,
  useAddMedication,
  useDeleteMedication,
  useMarkAsTaken,
  useUnmarkAsTaken,
} from "@/hooks/use-medications";
import { MedicationCard } from "@/components/medications/MedicationCard";
import { AddMedicationDialog } from "@/components/medications/AddMedicationDialog";
import { EmptyState } from "@/components/dashboard/EmptyState";
import { StreakCounter } from "@/components/dashboard/StreakCounter";
import { MedicationListSkeleton } from "@/components/dashboard/MedicationListSkeleton";
import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/constants";
import type { MedicationFormData } from "@/schemas/medication";

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: medications, isLoading, error } = useMedicationsWithStatus();
  const addMutation = useAddMedication();
  const deleteMutation = useDeleteMedication();
  const markTakenMutation = useMarkAsTaken();
  const unmarkMutation = useUnmarkAsTaken();

  const handleAddMedication = useCallback(
    (data: MedicationFormData) => {
      addMutation.mutate(data, {
        onSuccess: () => setDialogOpen(false),
      });
    },
    [addMutation],
  );

  const handleMarkTaken = useCallback(
    (id: string) => {
      markTakenMutation.mutate(id);
    },
    [markTakenMutation],
  );

  const handleUnmark = useCallback(
    (logId: string) => {
      unmarkMutation.mutate(logId);
    },
    [unmarkMutation],
  );

  const handleDelete = useCallback(
    (id: string) => {
      deleteMutation.mutate(id);
    },
    [deleteMutation],
  );

  const today = format(new Date(), "EEEE, MMMM d");

  return (
    <div className="min-h-screen bg-[hsl(var(--background))]">

      <header className="sticky top-0 z-40 border-b border-[hsl(var(--border))] bg-[hsl(var(--background))]/80 backdrop-blur-lg">
        <div className="mx-auto flex h-16 max-w-2xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Pill className="h-5 w-5 text-[hsl(var(--primary))]" />
            <span className="font-semibold">{APP_NAME}</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-[hsl(var(--muted-foreground))] hidden sm:block">
              {user?.email}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={signOut}
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">
              Hi, {user?.user_metadata?.full_name?.split(" ")[0] || "there"} 👋
            </h1>
            <p className="text-sm text-[hsl(var(--muted-foreground))]">
              {today}
            </p>
          </div>
          <Button onClick={() => setDialogOpen(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Add Medication</span>
          </Button>
        </div>

        {medications && medications.length > 0 && (
          <StreakCounter medications={medications} />
        )}

        {isLoading ? (
          <MedicationListSkeleton />
        ) : error ? (
          <div className="rounded-xl border border-[hsl(var(--destructive))]/30 bg-[hsl(var(--destructive))]/5 p-6 text-center">
            <p className="text-[hsl(var(--destructive))] font-medium">
              Failed to load medications
            </p>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
              {error instanceof Error
                ? error.message
                : "Please try again later."}
            </p>
          </div>
        ) : medications && medications.length === 0 ? (
          <EmptyState onAddClick={() => setDialogOpen(true)} />
        ) : (
          <div className="space-y-3">
            {medications?.map((med) => (
              <MedicationCard
                key={med.id}
                medication={med}
                onMarkTaken={handleMarkTaken}
                onUnmark={handleUnmark}
                onDelete={handleDelete}
                isMarking={
                  markTakenMutation.isPending &&
                  markTakenMutation.variables === med.id
                }
              />
            ))}
          </div>
        )}
      </main>

      <AddMedicationDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleAddMedication}
        isPending={addMutation.isPending}
      />
    </div>
  );
}
