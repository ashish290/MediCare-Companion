export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  caretaker_email: string | null;
  timezone: string;
  notification_time: string;
  created_at: string;
  updated_at: string;
}

export interface Medication {
  id: string;
  user_id: string;
  name: string;
  dosage: string;
  scheduled_time: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface MedicationLog {
  id: string;
  medication_id: string;
  user_id: string;
  log_date: string;
  taken_at: string;
  created_at: string;
}


export interface MedicationWithStatus extends Medication {
  taken_today: boolean;
  taken_at: string | null;
  log_id: string | null;
}

export interface MedicationInsert {
  name: string;
  dosage: string;
  scheduled_time?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  user_metadata: {
    full_name?: string;
  };
}
