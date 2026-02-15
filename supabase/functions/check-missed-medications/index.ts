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

    // send an email for each user with missed meds
    const results = await Promise.allSettled(
      rows.map((row) => sendNotification(row)),
    );

    const sent = results.filter((r) => r.status === "fulfilled").length;
    const failed = results.filter((r) => r.status === "rejected").length;

    return new Response(JSON.stringify({ sent, failed, total: rows.length }), {
      status: 200,
    });
  } catch (err) {
    console.error("Edge function error:", err);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
});

async function sendNotification(row: MissedMedRow): Promise<void> {
  const { caretaker_email, full_name, missed_medications } = row;

  if (!caretaker_email) return;

  const medList = missed_medications.map((m) => `<li>${m}</li>`).join("");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: "MediBuddy <noreply@yourdomain.com>",
      to: caretaker_email,
      subject: `⚠️ ${full_name || "Your patient"} missed medications today`,
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
          <h2>Medication Reminder</h2>
          <p><strong>${full_name || "Your patient"}</strong> has not taken the following medications today:</p>
          <ul>${medList}</ul>
          <p style="color: #666; font-size: 14px;">
            This is an automated notification from MediBuddy.
          </p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Resend API error: ${response.status} - ${body}`);
  }
}
