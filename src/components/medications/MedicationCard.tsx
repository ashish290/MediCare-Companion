import { memo, useState } from "react";
import { Check, Clock, Trash2, Undo2 } from "lucide-react";
import { cn, formatTime } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { MedicationWithStatus } from "@/types";

interface MedicationCardProps {
  medication: MedicationWithStatus;
  onMarkTaken: (id: string) => void;
  onUnmark: (logId: string) => void;
  onDelete: (id: string) => void;
  isMarking: boolean;
}

export const MedicationCard = memo(function MedicationCard({
  medication,
  onMarkTaken,
  onUnmark,
  onDelete,
  isMarking,
}: MedicationCardProps) {
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  function handleToggle() {
    if (medication.taken_today && medication.log_id) {
      onUnmark(medication.log_id);
    } else {
      onMarkTaken(medication.id);
    }
  }

  return (
    <div
      className={cn(
        "group relative flex items-center gap-4 rounded-xl border p-4 transition-all duration-200",
        medication.taken_today
          ? "border-[hsl(var(--success))]/30 bg-[hsl(var(--success))]/5"
          : "border-[hsl(var(--border))] bg-[hsl(var(--card))] hover:shadow-md",
      )}
    >
      <button
        onClick={handleToggle}
        disabled={isMarking}
        aria-label={
          medication.taken_today ? "Unmark as taken" : "Mark as taken"
        }
        className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200",
          medication.taken_today
            ? "border-[hsl(var(--success))] bg-[hsl(var(--success))] text-white"
            : "border-[hsl(var(--border))] hover:border-[hsl(var(--primary))] hover:bg-[hsl(var(--primary))]/10",
          isMarking && "opacity-50 cursor-wait",
        )}
      >
        {medication.taken_today ? (
          <Check className="h-5 w-5" />
        ) : (
          <div className="h-3 w-3 rounded-full" />
        )}
      </button>

      <div className="flex-1 min-w-0">
        <h3
          className={cn(
            "font-medium truncate",
            medication.taken_today &&
              "line-through text-[hsl(var(--muted-foreground))]",
          )}
        >
          {medication.name}
        </h3>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-sm text-[hsl(var(--muted-foreground))]">
            {medication.dosage}
          </span>
          <span className="flex items-center gap-1 text-xs text-[hsl(var(--muted-foreground))]">
            <Clock className="h-3 w-3" />
            {formatTime(medication.scheduled_time)}
          </span>
        </div>
      </div>

      {medication.taken_today && medication.taken_at && (
        <span className="text-xs text-[hsl(var(--success))] hidden sm:block">
          Taken at{" "}
          {new Date(medication.taken_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      )}

      <div className="shrink-0">
        {showConfirmDelete ? (
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant="destructive"
              onClick={() => {
                onDelete(medication.id);
                setShowConfirmDelete(false);
              }}
            >
              Delete
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setShowConfirmDelete(false)}
              aria-label="Cancel delete"
            >
              <Undo2 className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setShowConfirmDelete(true)}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="Delete medication"
          >
            <Trash2 className="h-4 w-4 text-[hsl(var(--muted-foreground))]" />
          </Button>
        )}
      </div>
    </div>
  );
});
