import Link from "next/link";
import Image from "next/image";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="surface-spotlight flex min-h-screen flex-col">
      <header className="p-6">
        <Link href="/" className="flex items-center gap-1.5">
          <Image src="/logo-transparent.png" alt="TLMI Logo" width={32} height={32} className="object-contain -mt-1" quality={100} priority />
          <span className="font-display text-xl font-bold text-ink-900 tracking-tight">TLMI</span>
          <span className="h-4 w-[1.5px] bg-ink-200" aria-hidden="true" />
          <span className="text-[15px] font-medium text-ink-500 tracking-tight">The Light Music Institute</span>
        </Link>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 pb-16">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
