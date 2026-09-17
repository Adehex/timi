"use client";

import { useActionState } from "react";
import Link from "next/link";
import { registerAction, type ActionState } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { FieldError } from "@/components/shared/field-error";

const initialState: ActionState = {};

export default function RegisterPage() {
  const [state, formAction, isPending] = useActionState(registerAction, initialState);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create your account</CardTitle>
        <CardDescription>Start with the essentials — you can complete your profile next.</CardDescription>
      </CardHeader>
      <CardContent>
        {state.error && (
          <Alert variant="danger" className="mb-4">
            {state.error}
          </Alert>
        )}
        <form action={formAction} className="space-y-4" noValidate>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="firstName">First name</Label>
              <Input id="firstName" name="firstName" autoComplete="given-name" className="mt-1.5" required />
              <FieldError messages={state.fieldErrors?.firstName} />
            </div>
            <div>
              <Label htmlFor="lastName">Last name</Label>
              <Input id="lastName" name="lastName" autoComplete="family-name" className="mt-1.5" required />
              <FieldError messages={state.fieldErrors?.lastName} />
            </div>
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" autoComplete="email" className="mt-1.5" required />
            <FieldError messages={state.fieldErrors?.email} />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              className="mt-1.5"
              required
            />
            <p className="mt-1 text-xs text-ink-400">
              At least 8 characters, with an uppercase letter and a number.
            </p>
            <FieldError messages={state.fieldErrors?.password} />
          </div>
          <Button type="submit" variant="gold" className="w-full" disabled={isPending}>
            {isPending ? "Creating account…" : "Create account"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-ink-500">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-gold-700 hover:underline">
            Log in
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
