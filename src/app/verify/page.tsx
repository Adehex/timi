import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

async function searchCertificateAction(formData: FormData) {
  "use server";
  const code = String(formData.get("code") ?? "").trim();
  if (code) redirect(`/verify/${encodeURIComponent(code)}`);
}

export const metadata = { title: "Verify a certificate" };

export default function VerifyLandingPage() {
  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center px-4">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Verify a certificate</CardTitle>
          <CardDescription>Enter the certificate number found on the document (e.g. TLMI-GTR-000184).</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={searchCertificateAction} className="space-y-4">
            <div>
              <Label htmlFor="code">Certificate number</Label>
              <Input id="code" name="code" placeholder="TLMI-GTR-000184" className="mt-1.5" required />
            </div>
            <Button type="submit" variant="gold" className="w-full">
              Verify
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
