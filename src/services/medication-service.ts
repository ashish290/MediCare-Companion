import { supabase } from "@/lib/supabase";
import type {
  Medication,
  MedicationInsert,
  MedicationWithStatus,
} from "@/types";
import { getTodayDateString } from "@/lib/utils";

export const medicationService = {
  async getAll(userId: string): Promise<Medication[]> {
    const { data, error } = await supabase
      .from("medications")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true)
      .order("scheduled_time", { ascending: true });

    if (error) throw error;
    return data;
  },

  async getWithTodayStatus(userId: string): Promise<MedicationWithStatus[]> {
    const today = getTodayDateString();

    const { data: medications, error: medError } = await supabase
      .from("medications")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true)
      .order("scheduled_time", { ascending: true });

    if (medError) throw medError;

    const { data: logs, error: logError } = await supabase
      .from("medication_logs")
      .select("*")
      .eq("user_id", userId)
      .eq("log_date", today);

    if (logError) throw logError;

    const logsByMedId = new Map(logs.map((log) => [log.medication_id, log]));

    return medications.map((med) => {
      const log = logsByMedId.get(med.id);
      return {
        ...med,
        taken_today: !!log,
        taken_at: log?.taken_at ?? null,
        log_id: log?.id ?? null,
      };
    });
  },

  async create(userId: string, data: MedicationInsert): Promise<Medication> {
    const { data: medication, error } = await supabase
      .from("medications")
      .insert({
        user_id: userId,
        name: data.name,
        dosage: data.dosage,
        scheduled_time: data.scheduled_time ?? "09:00:00",
      })
      .select()
      .single();

    if (error) throw error;
    return medication;
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from("medications").delete().eq("id", id);

    if (error) throw error;
  },
};
