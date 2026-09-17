import Link from "next/link";
import { verifyEmailAction } from "@/features/auth/actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const { token } = await searchParams;

  if (!token) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Check your inbox</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-ink-500">
            We sent a verification link to your email. Click it to activate your account.
          </p>
        </CardContent>
      </Card>
    );
  }

  const result = await verifyEmailAction(token);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Email verification</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {result.success ? (
          <Alert variant="success">{result.message}</Alert>
        ) : (
          <Alert variant="danger">{result.error}</Alert>
        )}
        <Button asChild variant="gold" className="w-full">
          <Link href="/login">Continue to login</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
