import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, type SignupFormData } from "@/schemas/auth";
import { authService } from "@/services/auth-service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SignupFormProps {
  onToggle: () => void;
}

export function SignupForm({ onToggle }: SignupFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  async function onSubmit(data: SignupFormData) {
    setError(null);
    setSubmitting(true);

    try {
      const { session } = await authService.signup({
        email: data.email,
        password: data.password,
        fullName: data.full_name,
        caretakerEmail: data.caretaker_email || undefined,
      });

      if (!session) {
        setSuccess(true);
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="text-4xl">✉️</div>
        <h3 className="text-lg font-semibold">Check your email</h3>
        <p className="text-sm text-[hsl(var(--muted-foreground))]">
          We sent you a confirmation link. Click it to activate your account.
        </p>
        <Button variant="outline" onClick={onToggle} className="w-full">
          Back to Sign In
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="signup-name">Full Name</Label>
        <Input
          id="signup-name"
          placeholder="John Doe"
          autoComplete="name"
          {...register("full_name")}
        />
        {errors.full_name && (
          <p className="text-sm text-[hsl(var(--destructive))]">
            {errors.full_name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-email">Email</Label>
        <Input
          id="signup-email"
          type="email"
          placeholder="you@example.com"
          autoComplete="email"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-sm text-[hsl(var(--destructive))]">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-password">Password</Label>
        <Input
          id="signup-password"
          type="password"
          placeholder="Min 8 chars, 1 uppercase, 1 number"
          autoComplete="new-password"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-sm text-[hsl(var(--destructive))]">
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-caretaker">
          Caretaker Email{" "}
          <span className="text-[hsl(var(--muted-foreground))]">
            (optional)
          </span>
        </Label>
        <Input
          id="signup-caretaker"
          type="email"
          placeholder="caretaker@example.com"
          {...register("caretaker_email")}
        />
        {errors.caretaker_email && (
          <p className="text-sm text-[hsl(var(--destructive))]">
            {errors.caretaker_email.message}
          </p>
        )}
        <p className="text-xs text-[hsl(var(--muted-foreground))]">
          This person gets notified if you miss your medications.
        </p>
      </div>

      {error && (
        <div className="rounded-md bg-[hsl(var(--destructive))]/10 p-3 text-sm text-[hsl(var(--destructive))]">
          {error}
        </div>
      )}

      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? "Creating account..." : "Create Account"}
      </Button>

      <p className="text-center text-sm text-[hsl(var(--muted-foreground))]">
        Already have an account?{" "}
        <button
          type="button"
          onClick={onToggle}
          className="text-[hsl(var(--primary))] hover:underline font-medium"
        >
          Sign in
        </button>
      </p>
    </form>
  );
}
