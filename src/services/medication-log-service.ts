import { supabase } from "@/lib/supabase";
import type { MedicationLog } from "@/types";
import { getTodayDateString } from "@/lib/utils";

export const medicationLogService = {
  async markTaken(
    medicationId: string,
    userId: string,
  ): Promise<MedicationLog> {
    const today = getTodayDateString();

    const { data, error } = await supabase
      .from("medication_logs")
      .insert({
        medication_id: medicationId,
        user_id: userId,
        log_date: today,
      })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") {
        throw new Error("Already marked as taken for today");
      }
      throw error;
    }

    return data;
  },

  async unmarkTaken(logId: string): Promise<void> {
    const { error } = await supabase
      .from("medication_logs")
      .delete()
      .eq("id", logId);

    if (error) throw error;
  },

  async getTodayLogs(userId: string): Promise<MedicationLog[]> {
    const today = getTodayDateString();

    const { data, error } = await supabase
      .from("medication_logs")
      .select("*")
      .eq("user_id", userId)
      .eq("log_date", today);

    if (error) throw error;
    return data;
  },
};
