"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { registerAction, type ActionState } from "@/features/auth/actions";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { FieldError } from "@/components/shared/field-error";
import { EyeIcon, EyeOffIcon } from "lucide-react";

import Image from "next/image";

interface RegisterModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToLogin?: () => void;
}

const initialState: ActionState = {};

export function RegisterModal({ open, onOpenChange, onSwitchToLogin }: RegisterModalProps) {
  const [state, formAction, isPending] = useActionState(registerAction, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0 overflow-y-auto border-0 bg-transparent flex flex-col md:flex-row shadow-2xl w-[95vw] md:w-full max-h-[95vh]">
        <DialogTitle className="sr-only">Create your account</DialogTitle>
        
        {/* Left Column - Branding */}
        <div className="hidden md:flex md:w-[45%] bg-[#1c1815] flex-col justify-between p-8 lg:p-12 text-marketing-cream relative overflow-hidden shrink-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#1c1815]/80 via-[#26201a]/50 to-[#120f0c] z-0"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-10">
              <Image src="/logo.jpg" alt="TLMI Logo" width={30} height={30} className="rounded-sm object-cover" />
              <span className="font-marketing-sans text-[11px] font-bold tracking-[0.2em] uppercase text-marketing-cream/90 mt-[2px]">
                TLMI LEARNING
              </span>
            </div>

            <h2 className="font-marketing-display text-[32px] lg:text-[42px] font-semibold leading-[1.05] tracking-tightest mb-4">
              Learn music.<br />Find your sound.
            </h2>
            <p className="text-marketing-cream/80 text-[14px] lg:text-[15px] max-w-[90%] mb-8 leading-relaxed">
              Join thousands of students mastering their instruments with structured courses and live feedback from real teachers.
            </p>

            <blockquote className="border-l-2 border-[#d49e39] pl-5">
              <p className="font-marketing-display italic text-base lg:text-lg leading-[1.3] mb-2">
                “The curriculum is structured beautifully. I finally understand the fretboard instead of just memorizing shapes.”
              </p>
              <footer className="text-[11px] lg:text-[12px] text-marketing-cream/60 font-marketing-sans">
                Marcus T. · Guitar Fundamentals Student
              </footer>
            </blockquote>
          </div>

          <div className="relative z-10 grid grid-cols-3 gap-4 pt-6 border-t border-marketing-cream/10 mt-8">
            <div>
              <div className="text-[9px] font-bold tracking-widest uppercase text-marketing-cream/50 mb-1.5">On-demand courses</div>
              <div className="font-marketing-display text-xl lg:text-2xl font-semibold">180+</div>
            </div>
            <div>
              <div className="text-[9px] font-bold tracking-widest uppercase text-marketing-cream/50 mb-1.5">Members learning</div>
              <div className="font-marketing-display text-xl lg:text-2xl font-semibold">2,400</div>
            </div>
            <div>
              <div className="text-[9px] font-bold tracking-widest uppercase text-marketing-cream/50 mb-1.5">Certification tracks</div>
              <div className="font-marketing-display text-xl lg:text-2xl font-semibold">12</div>
            </div>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="w-full md:w-[55%] bg-[#FBF7EF] p-8 lg:p-12 flex flex-col">
          <div className="max-w-[380px] w-full mx-auto flex-1 flex flex-col justify-center">
            <div className="mb-6">
              <h3 className="font-marketing-display text-3xl lg:text-[36px] font-semibold tracking-tightest text-marketing-ink mb-1">
                Create your account
              </h3>
              <p className="text-[14px] text-marketing-stone leading-relaxed">
                Start with the essentials — you can complete your profile next.
              </p>
            </div>

            {state.error && (
              <Alert variant="danger" className="mb-4 rounded-md">
                {state.error}
              </Alert>
            )}

            <form action={formAction} className="space-y-3 lg:space-y-4" noValidate>
              <div className="grid grid-cols-2 gap-3 lg:gap-4">
                <div className="space-y-1">
                  <Label htmlFor="firstName" className="text-[12px] font-medium text-marketing-ink">First name</Label>
                  <Input 
                    id="firstName" 
                    name="firstName" 
                    autoComplete="given-name" 
                    className="bg-white border-marketing-rule focus:border-marketing-gold focus:ring-marketing-gold rounded-[4px] h-10 lg:h-11 text-[14px] lg:text-[15px]" 
                    required 
                  />
                  <FieldError messages={state.fieldErrors?.firstName} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="lastName" className="text-[12px] font-medium text-marketing-ink">Last name</Label>
                  <Input 
                    id="lastName" 
                    name="lastName" 
                    autoComplete="family-name" 
                    className="bg-white border-marketing-rule focus:border-marketing-gold focus:ring-marketing-gold rounded-[4px] h-10 lg:h-11 text-[14px] lg:text-[15px]" 
                    required 
                  />
                  <FieldError messages={state.fieldErrors?.lastName} />
                </div>
              </div>

              <div className="space-y-1">
                <Label htmlFor="email" className="text-[12px] font-medium text-marketing-ink">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="you@company.com"
                  autoComplete="email" 
                  className="bg-white border-marketing-rule focus:border-marketing-gold focus:ring-marketing-gold rounded-[4px] placeholder:text-marketing-stone/40 h-10 lg:h-11 text-[14px] lg:text-[15px]" 
                  required 
                />
                <FieldError messages={state.fieldErrors?.email} />
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="password" className="text-[12px] font-medium text-marketing-ink block">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="new-password"
                    className="bg-white border-marketing-rule focus:border-marketing-gold focus:ring-marketing-gold rounded-[4px] placeholder:text-marketing-stone/40 h-10 lg:h-11 text-[14px] lg:text-[15px] pr-10"
                    required
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-marketing-stone hover:text-marketing-ink"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </button>
                </div>
                <p className="mt-1 text-[11px] text-marketing-stone leading-tight">
                  At least 8 characters, with an uppercase letter and a number.
                </p>
                <FieldError messages={state.fieldErrors?.password} />
              </div>

              <Button type="submit" className="w-full bg-[#181412] hover:bg-black text-white h-11 rounded-[4px] text-[14px] lg:text-[15px] font-medium transition-colors mt-2" disabled={isPending}>
                {isPending ? "Creating account…" : "Create account"}
              </Button>
            </form>
          </div>

          <div className="max-w-[380px] w-full mx-auto mt-8 pt-6 border-t border-marketing-rule/60 flex flex-col gap-6 lg:gap-8">
            <p className="text-[13px] text-marketing-stone leading-relaxed">
              Already have an account?{" "}
              {onSwitchToLogin ? (
                <button type="button" onClick={onSwitchToLogin} className="font-semibold text-[#b37719] hover:underline">
                  Log in
                </button>
              ) : (
                <Link href="/login" className="font-semibold text-[#b37719] hover:underline">Log in</Link>
              )}
            </p>

            <div className="flex flex-wrap items-center gap-4 text-[11px] text-marketing-stone/60">
              <span>© {new Date().getFullYear()} The Light Music Institute</span>
              <Link href="/privacy" className="hover:text-marketing-ink">Privacy</Link>
              <Link href="/terms" className="hover:text-marketing-ink">Terms</Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
