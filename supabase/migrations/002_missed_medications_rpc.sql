CREATE OR REPLACE FUNCTION get_missed_medications()
RETURNS TABLE (
  patient_email TEXT,
  caretaker_email TEXT,
  full_name TEXT,
  missed_medications TEXT[]
)
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT
    p.email AS patient_email,
    p.caretaker_email,
    p.full_name,
    array_agg(m.name || ' (' || m.dosage || ')') AS missed_medications
  FROM medications m
  JOIN profiles p ON m.user_id = p.id
  LEFT JOIN medication_logs ml
    ON m.id = ml.medication_id
    AND ml.log_date = CURRENT_DATE
  WHERE ml.id IS NULL
    AND m.is_active = true
    AND p.caretaker_email IS NOT NULL
    AND p.notification_time <= CURRENT_TIME
  GROUP BY p.id, p.email, p.caretaker_email, p.full_name;
$$;
