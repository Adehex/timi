import Link from "next/link";
import { ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <EmptyState
        icon={<ShieldAlert className="size-8" />}
        title="You don't have access to this page"
        description="If you think this is a mistake, contact your academy administrator."
        action={
          <Button asChild variant="gold">
            <Link href="/">Back to home</Link>
          </Button>
        }
      />
    </div>
  );
}
