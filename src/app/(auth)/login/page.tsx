"use client";

import { useActionState } from "react";
import Link from "next/link";
import { loginAction, type ActionState } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { FieldError } from "@/components/shared/field-error";

const initialState: ActionState = {};

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Log in to continue your learning journey.</CardDescription>
      </CardHeader>
      <CardContent>
        {state.error && (
          <Alert variant="danger" className="mb-4">
            {state.error}
          </Alert>
        )}
        <form action={formAction} className="space-y-4" noValidate>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" autoComplete="email" className="mt-1.5" required />
            <FieldError messages={state.fieldErrors?.email} />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/forgot-password" className="text-xs font-medium text-gold-700 hover:underline">
                Forgot password?
              </Link>
            </div>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              className="mt-1.5"
              required
            />
            <FieldError messages={state.fieldErrors?.password} />
          </div>
          <Button type="submit" variant="gold" className="w-full" disabled={isPending}>
            {isPending ? "Logging in…" : "Log in"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-ink-500">
          New to TLMI?{" "}
          <Link href="/register" className="font-medium text-gold-700 hover:underline">
            Create an account
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
