import { useMemo } from "react";
import { Flame } from "lucide-react";
import type { MedicationWithStatus } from "@/types";

interface StreakCounterProps {
  medications: MedicationWithStatus[];
}

export function StreakCounter({ medications }: StreakCounterProps) {
  const stats = useMemo(() => {
    if (medications.length === 0) {
      return { taken: 0, total: 0, percentage: 0 };
    }

    const taken = medications.filter((m) => m.taken_today).length;
    const total = medications.length;
    const percentage = Math.round((taken / total) * 100);

    return { taken, total, percentage };
  }, [medications]);

  return (
    <div className="flex items-center gap-6 rounded-xl bg-gradient-to-r from-[hsl(var(--primary))]/10 to-[hsl(var(--primary))]/5 border border-[hsl(var(--primary))]/20 p-5">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[hsl(var(--primary))]/20">
          <Flame className="h-6 w-6 text-[hsl(var(--primary))]" />
        </div>
        <div>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">
            Today's Progress
          </p>
          <p className="text-2xl font-bold">
            {stats.taken}
            <span className="text-base font-normal text-[hsl(var(--muted-foreground))]">
              {" / "}
              {stats.total}
            </span>
          </p>
        </div>
      </div>

      <div className="flex-1 hidden sm:block">
        <div className="h-3 w-full rounded-full bg-[hsl(var(--muted))] overflow-hidden">
          <div
            className="h-full rounded-full bg-[hsl(var(--primary))] transition-all duration-500 ease-out"
            style={{ width: `${stats.percentage}%` }}
          />
        </div>
        <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1 text-right">
          {stats.percentage}%
        </p>
      </div>
    </div>
  );
}
