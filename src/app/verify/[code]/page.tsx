import Link from "next/link";
import { CheckCircle2, XCircle } from "lucide-react";
import { verifyCertificate } from "@/lib/db/repositories/certificates";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function VerifyResultPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const certificate = await verifyCertificate(decodeURIComponent(code));

  return (
    <div className="mx-auto flex min-h-screen max-w-md items-center px-4">
      <Card className="w-full">
        <CardContent className="p-6 text-center">
          {certificate ? (
            <>
              <CheckCircle2 className="mx-auto size-10 text-success-500" />
              <h1 className="mt-3 font-display text-xl font-semibold text-ink-900">Certificate verified</h1>
              <div className="mt-4 space-y-2 text-left">
                <Row label="Certificate #" value={certificate.certificateNumber} />
                <Row label="Issued to" value={certificate.studentDisplayName} />
                <Row label="Course" value={certificate.courseTitle} />
                <Row label="Instrument" value={certificate.instrumentName} />
                <Row
                  label="Level"
                  value={<Badge variant="gold">{certificate.level}</Badge>}
                />
                <Row
                  label="Issued"
                  value={new Intl.DateTimeFormat("en-GB", { dateStyle: "long" }).format(certificate.issuedAt)}
                />
              </div>
            </>
          ) : (
            <>
              <XCircle className="mx-auto size-10 text-danger-500" />
              <h1 className="mt-3 font-display text-xl font-semibold text-ink-900">Not found</h1>
              <p className="mt-2 text-sm text-ink-500">
                We couldn&apos;t find a certificate matching &ldquo;{code}&rdquo;. Double-check the number and
                try again.
              </p>
            </>
          )}
          <Button asChild variant="outline" className="mt-6 w-full">
            <Link href="/verify">Verify another</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-ink-100 py-2 text-sm last:border-0">
      <span className="text-ink-400">{label}</span>
      <span className="font-medium text-ink-800">{value}</span>
    </div>
  );
}
