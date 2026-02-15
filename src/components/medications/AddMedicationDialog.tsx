import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  medicationSchema,
  type MedicationFormData,
} from "@/schemas/medication";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface AddMedicationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: MedicationFormData) => void;
  isPending: boolean;
}

export function AddMedicationDialog({
  open,
  onOpenChange,
  onSubmit,
  isPending,
}: AddMedicationDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MedicationFormData>({
    resolver: zodResolver(medicationSchema),
    defaultValues: {
      name: "",
      dosage: "",
      scheduled_time: "09:00",
    },
  });

  function handleFormSubmit(data: MedicationFormData) {
    onSubmit(data);
    reset();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Medication</DialogTitle>
          <DialogDescription>
            Enter the medication details. You can set the scheduled time to be
            reminded.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={handleSubmit(handleFormSubmit)}
          className="space-y-4 mt-4"
        >
          <div className="space-y-2">
            <Label htmlFor="med-name">Medication Name</Label>
            <Input
              id="med-name"
              placeholder="e.g. Aspirin"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-[hsl(var(--destructive))]">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="med-dosage">Dosage</Label>
            <Input
              id="med-dosage"
              placeholder="e.g. 500mg, 1 tablet"
              {...register("dosage")}
            />
            {errors.dosage && (
              <p className="text-sm text-[hsl(var(--destructive))]">
                {errors.dosage.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="med-time">Scheduled Time</Label>
            <Input id="med-time" type="time" {...register("scheduled_time")} />
            {errors.scheduled_time && (
              <p className="text-sm text-[hsl(var(--destructive))]">
                {errors.scheduled_time.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Adding..." : "Add Medication"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
