"use client";

import { useActionState } from "react";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { resetPasswordAction, type ActionState } from "@/features/auth/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { FieldError } from "@/components/shared/field-error";

const initialState: ActionState = {};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [state, formAction, isPending] = useActionState(resetPasswordAction, initialState);

  if (!token) {
    return (
      <Card>
        <CardContent className="pt-6">
          <Alert variant="danger" title="Missing reset token">
            This link is incomplete. Request a new password reset email.
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Choose a new password</CardTitle>
        <CardDescription>Make it something you haven&apos;t used before.</CardDescription>
      </CardHeader>
      <CardContent>
        {state.error && (
          <Alert variant="danger" className="mb-4">
            {state.error}
          </Alert>
        )}
        {state.success ? (
          <Alert variant="success">
            {state.message}{" "}
            <Link href="/login" className="font-medium underline">
              Log in
            </Link>
          </Alert>
        ) : (
          <form action={formAction} className="space-y-4" noValidate>
            <input type="hidden" name="token" value={token} />
            <div>
              <Label htmlFor="password">New password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                className="mt-1.5"
                required
              />
              <FieldError messages={state.fieldErrors?.password} />
            </div>
            <Button type="submit" variant="gold" className="w-full" disabled={isPending}>
              {isPending ? "Updating…" : "Update password"}
            </Button>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
