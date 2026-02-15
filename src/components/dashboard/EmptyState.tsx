import { Pill } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  onAddClick: () => void;
}

export function EmptyState({ onAddClick }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[hsl(var(--primary))]/10 mb-6">
        <Pill className="h-10 w-10 text-[hsl(var(--primary))]" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No medications yet</h3>
      <p className="text-sm text-[hsl(var(--muted-foreground))] text-center max-w-sm mb-6">
        Start by adding your medications. We'll help you track them daily and
        notify your caretaker if you miss any.
      </p>
      <Button onClick={onAddClick}>Add Your First Medication</Button>
    </div>
  );
}
