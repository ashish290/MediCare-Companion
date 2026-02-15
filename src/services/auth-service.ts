import { supabase } from "@/lib/supabase";

interface SignupParams {
  email: string;
  password: string;
  fullName: string;
  caretakerEmail?: string;
}

export const authService = {
  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data;
  },

  async signup({ email, password, fullName, caretakerEmail }: SignupParams) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          caretaker_email: caretakerEmail || null,
        },
      },
    });

    if (error) throw error;

    return data;
  },

  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },

  async getSession() {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) throw error;
    return session;
  },

  async updateCaretakerEmail(userId: string, email: string) {
    const { error } = await supabase
      .from("profiles")
      .update({ caretaker_email: email })
      .eq("id", userId);

    if (error) throw error;
  },
};
