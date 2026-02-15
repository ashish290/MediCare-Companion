import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

interface MissedMedRow {
  patient_email: string;
  caretaker_email: string;
  full_name: string;
  missed_medications: string[];
}

Deno.serve(async () => {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const { data, error } = await supabase.rpc("get_missed_medications");

    if (error) {
      console.error("Query error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }

    const rows = data as MissedMedRow[];

    if (!rows || rows.length === 0) {
      console.log("No missed medications found.");
      return new Response(
        JSON.stringify({ message: "No missed medications" }),
        { status: 200 },
      );
    }

    // Log the missed medications instead of emailing
    console.log(`Found ${rows.length} users with missed medications:`);
    rows.forEach((row) => {
      console.log(
        `[MISSED] Patient: ${row.full_name} (${row.patient_email}) | Caretaker: ${row.caretaker_email} | Meds: ${row.missed_medications.join(", ")}`,
      );
    });

    return new Response(
      JSON.stringify({
        message: "Logged missed medications",
        count: rows.length,
      }),
      { status: 200 },
    );
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
});
