"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import { loginAction, type ActionState } from "@/features/auth/actions";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { FieldError } from "@/components/shared/field-error";
import { EyeIcon, EyeOffIcon } from "lucide-react";

interface LoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const initialState: ActionState = {};

export function LoginModal({ open, onOpenChange }: LoginModalProps) {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl p-0 overflow-hidden border-0 bg-transparent flex flex-col md:flex-row shadow-2xl h-[90vh] md:h-[800px] max-h-[90vh]">
        <DialogTitle className="sr-only">Login to TLMI</DialogTitle>
        
        {/* Left Column - Branding */}
        <div className="hidden md:flex md:w-[45%] bg-[#1c1815] flex-col justify-between p-12 text-marketing-cream relative overflow-hidden shrink-0">
          {/* Placeholder Background */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#1c1815]/80 via-[#26201a]/50 to-[#120f0c] z-0"></div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-16">
              <span className="flex h-[30px] w-[30px] items-center justify-center rounded-[3px] bg-[#d49e39] font-marketing-sans font-bold text-marketing-ink text-sm leading-none">
                T
              </span>
              <span className="font-marketing-sans text-[11px] font-bold tracking-[0.2em] uppercase text-marketing-cream/90">
                TLMI LEARNING
              </span>
            </div>

            <h2 className="font-marketing-display text-[42px] font-semibold leading-[1.05] tracking-tightest mb-6">
              Skills that keep the<br />presses running.
            </h2>
            <p className="text-marketing-cream/80 text-[15px] max-w-[90%] mb-12 leading-relaxed">
              Training built by and for the label and packaging industry — from press fundamentals to sustainability compliance.
            </p>

            <blockquote className="border-l-2 border-[#d49e39] pl-5 mb-8">
              <p className="font-marketing-display italic text-lg leading-[1.3] mb-3">
                “The flexo fundamentals track got two of my new press operators production-ready in a month.”
              </p>
              <footer className="text-[12px] text-marketing-cream/60 font-marketing-sans">
                Dana Whitfield · Plant Manager, Northline Label Co.
              </footer>
            </blockquote>
          </div>

          <div className="relative z-10 grid grid-cols-3 gap-6 pt-10 border-t border-marketing-cream/10 mt-auto">
            <div>
              <div className="text-[9px] font-bold tracking-widest uppercase text-marketing-cream/50 mb-2">On-demand courses</div>
              <div className="font-marketing-display text-2xl font-semibold">180+</div>
            </div>
            <div>
              <div className="text-[9px] font-bold tracking-widest uppercase text-marketing-cream/50 mb-2">Members learning</div>
              <div className="font-marketing-display text-2xl font-semibold">2,400</div>
            </div>
            <div>
              <div className="text-[9px] font-bold tracking-widest uppercase text-marketing-cream/50 mb-2">Certification tracks</div>
              <div className="font-marketing-display text-2xl font-semibold">12</div>
            </div>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="w-full md:w-[55%] bg-[#FBF7EF] p-8 md:p-14 flex flex-col overflow-y-auto">
          <div className="flex justify-end mb-12 md:mb-16">
            <Link href="/help" className="text-[13px] text-marketing-stone hover:text-marketing-ink flex items-center gap-1 transition-colors">
              Need help signing in? ↗
            </Link>
          </div>

          <div className="max-w-[380px] w-full mx-auto flex-1">
            <h3 className="font-marketing-display text-[40px] font-semibold tracking-tightest text-marketing-ink mb-3">
              Welcome back
            </h3>
            <p className="text-[15px] text-marketing-stone mb-10 leading-relaxed pr-8">
              Log in to pick up your courses, certifications, and saved resources.
            </p>

            {state.error && (
              <Alert variant="danger" className="mb-6 rounded-md">
                {state.error}
              </Alert>
            )}

            <form action={formAction} className="space-y-6" noValidate>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-[13px] font-medium text-marketing-ink">Email</Label>
                <Input 
                  id="email" 
                  name="email" 
                  type="email" 
                  placeholder="you@company.com"
                  autoComplete="email" 
                  className="bg-white border-marketing-rule focus:border-marketing-gold focus:ring-marketing-gold rounded-[4px] placeholder:text-marketing-stone/40 h-11 text-[15px]" 
                  required 
                />
                <FieldError messages={state.fieldErrors?.email} />
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-[13px] font-medium text-marketing-ink">Password</Label>
                  <Link href="/forgot-password" className="text-[12px] font-medium text-[#b37719] hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="bg-white border-marketing-rule focus:border-marketing-gold focus:ring-marketing-gold rounded-[4px] placeholder:text-marketing-stone/40 h-11 text-[15px] pr-10"
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
                <FieldError messages={state.fieldErrors?.password} />
              </div>

              <div className="flex items-center gap-3 pt-1 pb-2">
                <input 
                  type="checkbox" 
                  id="remember" 
                  className="h-4 w-4 rounded-[3px] border-marketing-rule text-[#097df3] focus:ring-[#097df3] accent-[#097df3]" 
                  defaultChecked
                />
                <label htmlFor="remember" className="text-[14px] text-marketing-ink/80 select-none cursor-pointer">
                  Keep me signed in on this device
                </label>
              </div>

              <Button type="submit" className="w-full bg-[#181412] hover:bg-black text-white h-12 rounded-[4px] text-[15px] font-medium transition-colors" disabled={isPending}>
                {isPending ? "Logging in…" : "Log in"}
              </Button>
            </form>
          </div>

          <div className="max-w-[380px] w-full mx-auto mt-12 pt-8 border-t border-marketing-rule/60 flex flex-col gap-10">
            <p className="text-[13px] text-marketing-stone leading-relaxed">
              New to TLMI? <Link href="/register" className="font-semibold text-[#b37719] hover:underline">Create an account</Link> — free for member companies.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-[11px] text-marketing-stone/60">
              <span>© {new Date().getFullYear()} Tag & Label Manufacturers Institute</span>
              <Link href="/privacy" className="hover:text-marketing-ink">Privacy</Link>
              <Link href="/terms" className="hover:text-marketing-ink">Terms</Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
